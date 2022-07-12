# Fields JS

A very simple JS package for form validation.

- Framework agnostic.
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

// Define your form fields.
let fields: {
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
this.form = new Form(fields);

// Update a fields value.
this.form.update('email', 'johndoe@mail.com');

// Validate the entire form.
let { form, valid } = this.form.value();
fields = form;
if (valid ) { 
  console.log("The Form is valid.")
} else {
  console.log("The Form is has validation errors.")
}

// Check validation status of individual form fields.
if (fields.email.valid) {
  console.log("The email field is valid.");
}

// Check pristine status of individual form fields.
if (fields.email.touched) {
  console.log("The email field is has been edited.");
}
```

## License

MIT
