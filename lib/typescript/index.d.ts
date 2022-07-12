/**
 * Form validator.
 */
export default class Form {
    private formData;
    constructor(data: {
        [s: string]: any;
    });
    /**
     * Formats grouped forms for internal processing.
     * @param {*} index
     * @param {*} fields
     * @returns
     */
    static group(index: number, fields: any): {
        formGroupIndex: number;
        formGroupFields: any;
    };
    /**
     * Validates a Form Object with multiple levels. (Internal)
     * @param {*} formObject
     * @param {*} testResult
     * @returns
     */
    private evaluateForm;
    /**
     * Validates a field. (Internal)
     * @param {*} fieldName
     * @returns
     */
    private validate;
    /**
     * Tests the field againts supplied validators. (Internal)
     * @param {*} form
     * @param {*} fieldName
     * @param {*} tested
     * @returns
     */
    private evaluateField;
    /**
     * Updates the field validator for a single form field. (Internal)
     * @param {*} key
     * @param {*} validator
     * @returns form
     */
    private updateValidator;
    /**
     * Updates and validates a single form field.
     * @param {*} key
     * @param {*} value
     * @returns form
     */
    update: (key: string, value: any, form?: {
        [s: string]: any;
    }) => any;
    /**
      * Updates multiple fields at once and supports applying additional form config.
      * Accepts {key: {validator: ValidatorObject}} to update field validation.
      * @param entity
      * @param form
      * @returns
      */
    updateAll: (entity: {
        [s: string]: any;
    }, form?: {
        [s: string]: any;
    }) => {
        [s: string]: any;
    };
    /**
     * Add a field to the form.
     * @param {*} key
     * @param {*} entity
     * @param {*} form
     * @returns
     */
    addField: (key: string, entity: any, form?: any) => any;
    /**
     * Removes a field from the form. Supports index for fields that contain an array.
     * @param {*} key
     * @param {*} index
     * @param {*} form
     * @returns
     */
    removeField: (key: string, index?: any, form?: any) => any;
    /**
     * Validates the entire form, returns the mutated form object and form validation state.
     * @returns Object {form, valid}
     */
    value: () => {
        form: any;
        valid: boolean;
    };
    /**
     * Resets the value and validation state of the specified form field.
     * @param {*} key
     * @returns
     */
    reset: (key: string, form?: {
        [s: string]: any;
    }) => {
        form: {
            [s: string]: any;
        };
    };
    /**
     * Resets all form fields.
     * @returns
     */
    resetAll: (form?: {
        [s: string]: any;
    }) => {
        form: {
            [s: string]: any;
        };
    };
    /**
     * Populates all form fields without having to reinitialize the form class.
     * @param {*} entity
     * @returns
     */
    hydrate: (entity: {
        [s: string]: any;
    }, form?: {
        [s: string]: any;
    }) => {
        [s: string]: any;
    };
}
//# sourceMappingURL=index.d.ts.map