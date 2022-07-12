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

// Initialize Fields-JS
this.form = new Form(fields);

// Update a field's value.
this.form.update('email', 'johndoe@mail.com');

// Validate the entire form.
let { form, valid } = this.form.value();

// Update scoped variable (not necessary but it's nice to do.)
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

## Update Multiple Fields
```js
fields = this.form.updateAll({ 
  email: 'email@address.com',  
  fullname: 'Email Address' 
});
```

## Update Validation For A Field
```js
fields = this.form.updateAll({ 
  email: {value: 'newemail@value.com', validator: null}
});
```

## Add Or Remove A Field
```js
// Add
fields = this.form.addField('fieldName', {value: '', validator: null});

// Remove
fields = this.form.removeField('fieldName');
```
Fields can also be removed from a sub form group by specifying an index number as the second parameter.
```js
fields = this.form.removeField('Sub-Form-Group-Name', 2);
```

## Reset Form Fields
```js
fields = this.form.resetAll();
```


## License

MIT
