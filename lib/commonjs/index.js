"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const defined_1 = require("./defined");
const emailRegex = new RegExp("^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$");
/**
 * Form validator.
 */
class Form {
    formData;
    constructor(data) {
        this.formData = data;
    }
    /**
     * Formats grouped forms for internal processing.
     * @param {*} index
     * @param {*} fields
     * @returns
     */
    static group(index, fields) {
        return { formGroupIndex: index, formGroupFields: fields };
    }
    /**
     * Validates a Form Object with multiple levels. (Internal)
     * @param {*} formObject
     * @param {*} testResult
     * @returns
     */
    evaluateForm = (formObject, testResult) => {
        let form = formObject;
        let testValues = testResult;
        Object.keys(form).forEach((key) => {
            // check if form[key] is an array
            if (Array.isArray(form[key])) {
                form[key].forEach((i, index) => {
                    const { form: formData, valid } = this.evaluateForm(i, testValues);
                    form[key][index] = formData;
                    testValues.push(valid);
                });
            }
            else {
                // else treat it as a linear form field
                const { form: formData, tested: testArray } = this.evaluateField(form, key, testValues);
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
    validate = (fieldName, form = this.formData) => {
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
    evaluateField = (form, fieldName, tested = null) => {
        const testValues = tested;
        form[fieldName]['touched'] = true;
        if ((0, defined_1.isDefined)(form[fieldName].validator)) {
            const testValue = [];
            let validators = form[fieldName].validator;
            if (!Array.isArray(validators)) {
                // Force validators variable to contain an array
                validators = [validators];
            }
            validators.forEach((i) => {
                if (typeof i !== 'string') {
                    if (typeof i == 'function') {
                        testValue.push(i.apply(null, [form[fieldName].value]));
                    }
                    else {
                        testValue.push(i.test(form[fieldName].value));
                    }
                }
                else {
                    if (i == 'email') {
                        testValue.push(emailRegex.test(form[fieldName].value));
                    }
                    else {
                        testValue.push((0, defined_1.isDefined)(form[fieldName].value) ? true : false);
                    }
                }
            });
            form[fieldName]['valid'] = testValue.includes(false) ? false : true;
            if ((0, defined_1.isDefined)(testValues)) {
                testValues.push(form[fieldName]['valid']);
            }
        }
        else {
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
    updateValidator = (key, validator, form = this.formData) => {
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
    update = (key, value, form = this.formData) => {
        if ((0, defined_1.isDefined)(value)) {
            const { formGroupIndex, formGroupFields } = value;
            // if formGroupIndex is a property, pass the formFields property to updateAll()
            if ((0, defined_1.isDefined)(formGroupIndex)) {
                if ((0, defined_1.isDefined)(formGroupFields)) {
                    form[key][formGroupIndex] = this.updateAll(formGroupFields, form[key][formGroupIndex]);
                }
            }
            else {
                form[key].value = value;
                form[key]['pristine'] = false;
            }
        }
        else {
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
    updateAll = (entity, form = this.formData) => {
        if ((0, defined_1.isDefined)(entity)) {
            for (const [key, body] of Object.entries(entity)) {
                if ((0, defined_1.isDefined)(form[key])) {
                    if ((0, defined_1.isDefined)(body)) {
                        const { validator, formGroupIndex, formGroupFields } = body;
                        // if formGroupIndex is a property, recursively pass the formFields property to updateAll()
                        if ((0, defined_1.isDefined)(formGroupIndex)) {
                            if ((0, defined_1.isDefined)(formGroupFields)) {
                                form[key][formGroupIndex] = this.updateAll(formGroupFields, form[key][formGroupIndex]);
                            }
                        }
                        else {
                            if (typeof validator !== 'undefined') {
                                // only the field's validator was provided
                                this.updateValidator(key, validator, form);
                                const { value } = body;
                                if (typeof value !== 'undefined') {
                                    // the field's value was provided
                                    this.update(key, value, form);
                                }
                            }
                            else {
                                // the field's value was provided
                                this.update(key, body, form);
                            }
                        }
                    }
                    else {
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
    addField = (key, entity, form = this.formData) => {
        if ((0, defined_1.isDefined)(form[key]) && Array.isArray(form[key])) {
            form[key].push(entity);
        }
        else {
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
    removeField = (key, index = null, form = this.formData) => {
        if ((0, defined_1.isDefined)(form[key]) && Array.isArray(form[key]) && (0, defined_1.isDefined)(index)) {
            form[key].splice(index, 1);
        }
        else {
            delete form[key];
        }
        return form;
    };
    /**
     * Validates the entire form, returns the mutated form object and form validation state.
     * @returns Object {form, valid}
     */
    value = () => {
        return this.evaluateForm(this.formData, []);
    };
    /**
     * Resets the value and validation state of the specified form field.
     * @param {*} key
     * @returns
     */
    reset = (key, form = this.formData) => {
        form[key].value = '';
        form[key]['pristine'] = true;
        form[key]['touched'] = false;
        form[key]['valid'] = true;
        return { form };
    };
    /**
     * Resets all form fields.
     * @returns
     */
    resetAll = (form = this.formData) => {
        Object.keys(form).forEach((key) => {
            if (Array.isArray(form[key])) {
                form[key].forEach((i, index) => {
                    const { form: formData } = this.resetAll(i);
                    form[key][index] = formData;
                });
            }
            else {
                form[key].value = '';
                form[key]['pristine'] = true;
                form[key]['touched'] = false;
                form[key]['valid'] = true;
            }
        });
        return { form };
    };
    /**
     * Populates all form fields without having to reinitialize the form class.
     * @param {*} entity
     * @returns
     */
    hydrate = (entity, form = this.formData) => {
        if ((0, defined_1.isDefined)(entity)) {
            for (const [key, value] of Object.entries(entity)) {
                if ((0, defined_1.isDefined)(form[key])) {
                    if (Array.isArray(form[key])) {
                        form[key].forEach((i, index) => {
                            const { form: formData } = this.hydrate(value, i);
                            form[key][index] = formData;
                        });
                    }
                    else {
                        form[key].value = value;
                        form[key]['pristine'] = true;
                    }
                }
            }
        }
        return form;
    };
}
exports.default = Form;
