import { isDefined } from './defined';

const emailRegex = new RegExp(
  "^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$"
);

/**
 * Form validator.
 */
export default class Form {
  private formData: { [s: string]: any };

  constructor(data: { [s: string]: any }) {
    this.formData = data;
  }

  /**
   * Formats grouped forms for internal processing.
   * @param {*} index
   * @param {*} fields
   * @returns
   */
  public static group(index: number, fields: any) {
    return { formGroupIndex: index, formGroupFields: fields };
  }

  /**
   * Validates a Form Object with multiple levels. (Internal)
   * @param {*} formObject
   * @param {*} testResult
   * @returns
   */
  private evaluateForm = (formObject: any, testResult: Array<any>) => {
    let form = formObject;
    let testValues = testResult;
    Object.keys(form).forEach((key) => {
      // check if form[key] is an array
      if (Array.isArray(form[key])) {
        form[key].forEach((i: any, index: number) => {
          const { form: formData, valid } = this.evaluateForm(i, testValues);
          form[key][index] = formData;
          testValues.push(valid);
        });
      } else {
        // else treat it as a linear form field
        const { form: formData, tested: testArray } = this.evaluateField(
          form,
          key,
          testValues
        );
        form = formData;
        testValues = testArray;
      }
    });
    return { form: form, valid: testValues.includes(false) ? false : true };
  };

  /**
   * Validates a field. (Internal)
   * @param {*} fieldName
   * @returns
   */
  private validate = (fieldName: string, form = this.formData): any => {
    const { form: formData } = this.evaluateField(form, fieldName);
    return formData;
  };

  /**
   * Tests the field againts supplied validators. (Internal)
   * @param {*} form
   * @param {*} fieldName
   * @param {*} tested
   * @returns
   */
  private evaluateField = (
    form: any,
    fieldName: string,
    tested: any = null
  ) => {
    const testValues: Array<any> = tested;
    form[fieldName]['touched'] = true;
    if (isDefined(form[fieldName].validator)) {
      const testValue: Array<any> = [];
      let validators: Array<any> = form[fieldName].validator;
      if (!Array.isArray(validators)) {
        // Force validators variable to contain an array
        validators = [validators];
      }
      validators.forEach((i: any) => {
        if (typeof i !== 'string') {
          if (typeof i == 'function') {
            testValue.push(i.apply(null, [form[fieldName].value]));
          } else {
            testValue.push(i.test(form[fieldName].value));
          }
        } else {
          if (i == 'email') {
            testValue.push(emailRegex.test(form[fieldName].value));
          } else {
            testValue.push(isDefined(form[fieldName].value) ? true : false);
          }
        }
      });
      form[fieldName]['valid'] = testValue.includes(false) ? false : true;
      if (isDefined(testValues)) {
        testValues.push(form[fieldName]['valid']);
      }
    } else {
      // if no validators are defined (optional field), set it to valid
      form[fieldName]['valid'] = true;
    }
    return { form: form, tested: testValues };
  };

  /**
   * Updates the field validator for a single form field. (Internal)
   * @param {*} key
   * @param {*} validator
   * @returns form
   */
  private updateValidator = (
    key: string,
    validator: any,
    form = this.formData
  ) => {
    form[key].validator = validator;
    form[key]['pristine'] = false;
    return this.validate(key, form);
  };

  /**
   * Updates and validates a single form field.
   * @param {*} key
   * @param {*} value
   * @returns form
   */
  public update = (key: string, value: any, form = this.formData) => {
    if (isDefined(value)) {
      const { formGroupIndex, formGroupFields } = value;
      // if formGroupIndex is a property, pass the formFields property to updateAll()
      if (isDefined(formGroupIndex)) {
        if (isDefined(formGroupFields)) {
          form[key][formGroupIndex] = this.updateAll(
            formGroupFields,
            form[key][formGroupIndex]
          );
        }
      } else {
        form[key].value = value;
        form[key]['pristine'] = false;
      }
    } else {
      // the field's value was passed as null
      form[key].value = value;
      form[key]['pristine'] = false;
    }
    return this.validate(key, form);
  };

  /**
   * Updates multiple fields at once and supports applying additional form config.
   * Accepts {key: {validator: ValidatorObject}} to update field validation.
   * @param entity
   * @param form
   * @returns
   */
  public updateAll = (entity: { [s: string]: any }, form = this.formData) => {
    if (isDefined(entity)) {
      for (const [key, body] of Object.entries(entity)) {
        if (isDefined(form[key])) {
          if (isDefined(body)) {
            const { validator, formGroupIndex, formGroupFields } = body;
            // if formGroupIndex is a property, recursively pass the formFields property to updateAll()
            if (isDefined(formGroupIndex)) {
              if (isDefined(formGroupFields)) {
                form[key][formGroupIndex] = this.updateAll(
                  formGroupFields,
                  form[key][formGroupIndex]
                );
              }
            } else {
              if (typeof validator !== 'undefined') {
                // only the field's validator was provided
                this.updateValidator(key, validator, form);
                const { value } = body;
                if (typeof value !== 'undefined') {
                  // the field's value was provided
                  this.update(key, value, form);
                }
              } else {
                // the field's value was provided
                this.update(key, body, form);
              }
            }
          } else {
            // the field's value was passed as null
            this.update(key, body, form);
          }
        }
      }
    }
    return form;
  };

  /**
   * Add a field to the form.
   * @param {*} key
   * @param {*} entity
   * @param {*} form
   * @returns
   */
  public addField = (key: string, entity: any, form: any = this.formData) => {
    if (isDefined(form[key]) && Array.isArray(form[key])) {
      form[key].push(entity);
    } else {
      form[key] = entity;
    }
    return form;
  };

  /**
   * Removes a field from the form. Supports index for fields that contain an array.
   * @param {*} key
   * @param {*} index
   * @param {*} form
   * @returns
   */
  public removeField = (
    key: string,
    index: any = null,
    form: any = this.formData
  ) => {
    if (isDefined(form[key]) && Array.isArray(form[key]) && isDefined(index)) {
      form[key].splice(index, 1);
    } else {
      delete form[key];
    }
    return form;
  };

  /**
   * Validates the entire form, returns the mutated form object and form validation state.
   * @returns Object {form, valid}
   */
  public value = () => {
    return this.evaluateForm(this.formData, []);
  };

  /**
   * Resets the value and validation state of the specified form field.
   * @param {*} key
   * @returns
   */
  public reset = (key: string, form: any = this.formData) => {
    form[key]['value'] = '';
    form[key]['pristine'] = true;
    form[key]['touched'] = false;
    form[key]['valid'] = true;
    return { form };
  };

  /**
   * Resets all form fields.
   * @returns
   */
  public resetAll = (form: any = this.formData) => {
    Object.keys(form).forEach((key) => {
      if (Array.isArray(form[key])) {
        form[key].forEach((i: any, index: string | number) => {
          const { form: formData } = this.resetAll(i);
          form[key][index] = formData;
        });
      } else {
        ({ form } = this.reset(key, form));
      }
    });
    return { form };
  };

  /**
   * Populates all form fields without having to reinitialize the form class.
   * @param {*} entity
   * @returns
   */
  public hydrate = (entity: { [s: string]: any }, form = this.formData) => {
    if (isDefined(entity)) {
      for (const [key, value] of Object.entries(entity)) {
        if (isDefined(form[key])) {
          // Ensure that both the existing form key value and the supplied value are Arrays
          if (Array.isArray(form[key]) && Array.isArray(value)) {
            value.forEach((i: any, index: string | number) => {
              const formData = this.hydrate(value, i);
              form[key][index] = formData;
            });
          } else {
            form[key]['value'] = entity[key].value;
            form[key]['validator'] = entity[key].validator;
            form[key]['pristine'] = true;
          }
        }
      }
    }
    return form;
  };
}
