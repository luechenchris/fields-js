# Fields JS

A very simple JS package for form validation.

- JS Framework agnostic.
- UI-less.
- Maximum flexibility.

## Installation

```sh
npm install fields-js
# OR
yarn add fields-js
```

## Usage

```js
import Form from 'fields-js';

// Define your form fields. You can also save the object to state.
let fields = {
  email: {
    value: '',
    validator: ['email'],
  },
  fullname: {
    value: '',
    validator: ['required'],
  },
  password: {
    value: '',
    validator: [new RegExp('^(?=.{6,})(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z 0-9]).*$')],
  },
  password_confirmation: {
    value: '',
    validator: [(text) => {
      return text == fields.password.value;
    }],
  },
};

// Initialize Fields-JS
this.form = new Form(fields);
```

## Update A Field's Value.
```js
// Update scoped variable (not necessary but it's great for mutating state)
fields = this.form.update('email', 'johndoe@mail.com');
```

## Validate The Form.
```js
let { form, valid } = this.form.value();

// Update scoped variable
fields = form;

if (valid ) { 
  console.log("The Form is valid.");
} else {
  console.log("The Form has validation errors.");
}
```

## Check Validation Status Of A Form Field.
```js
if (fields.email.valid) {
  console.log("The email field is valid.");
}

// Check pristine status of individual form fields.
if (fields.email.touched) {
  console.log("The email field has been edited.");
}
```

## Update Multiple Fields
```js
let fields = this.form.updateAll({ 
  email: 'email@address.com',  
  fullname: 'Email Address' 
});
```

## Update Validator For A Field
```js
let fields = this.form.updateAll({ 
  email: {value: 'newemail@value.com', validator: null}
});
```

## Create and Update Form Groups
```js
// Defined a form group with a single field.
let fields = {
  users: [
    {
      name: {
        value: null,
        validator: ['required'],
      },
      email: {
        value: null,
        validator: ['email'],
      }
    }
  ]
}

// Initialize Fields-JS
this.form = new Form(fields);

// Update Form Group Fields
const index = 0; // Index of the targetted field in the Form Group `users`

// Add a single field to the Form Group `users`. 
this.form.update({ users: Form.group(index, { name: 'User Name', email: 'User Email' }) });
```
`Form.update(...)` can be called repeatedly to append new fields to the form group. Fields do not have to be of the same object structure when added.

## Add Or Remove A Field
```js
// Add
let fields = this.form.addField('fieldName', {value: '', validator: null});

// Remove
let fields = this.form.removeField('fieldName');
```
Fields can also be removed from a sub form group by specifying an `index number` as the second parameter.

```js
const index = 0; // Index of the targetted field in the Form Group `users`
let fields = this.form.removeField('users', index);
```

## Reset All Form Fields
```js
let fields = this.form.resetAll();
```
A single field can also be reset using `Form.reset('fieldName')`. Using these methods also resets the `touched` value for each field to false.

## License

MIT
