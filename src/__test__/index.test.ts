import Form from '../index';

let fields = {
  email: {
    value: null,
    validator: ['email'],
  },
  emailConfirmation: {
    value: null,
    validator: (text: string) => {
      return text == 'johndoe@gmail.com';
    }
  }
}

let form = new Form(fields);

describe('Form Validation', () => {
  test('Valid Field', () => {
    form.updateAll({ email: 'johndoe@gmail.com', emailConfirmation: 'johndoe@gmail.com' });
    let { form: fields } = form.value();
    expect(fields.email.valid).toBe(true);
    expect(fields.emailConfirmation.valid).toBe(true);
  });

  test('Invalid Field', () => {
    form.update('email', 'johndoegmail.com');
    form.update('emailConfirmation', 'johndoegmail.com');
    let { form: fields } = form.value();
    expect(fields.email.valid).toBe(false);
    expect(fields.emailConfirmation.valid).toBe(false);
  });

  test('Form Reset', () => {
    form.resetAll();
    let { valid, form: fields } = form.value();
    expect(valid).toBe(false);
    expect(fields.email.value).toBe('');
  });
});

describe('Adding Fields To Form', () => {
  test('Add Form Group', () => {
    form.addField('users', [{
      name: {
        value: null,
        validator: ['required'],
      },
      email: {
        value: null,
        validator: ['email'],
      }
    }]);
    let { form: fields } = form.value();
    expect(fields.users[0].name.value).toBeNull();
  });

  test('Add Field To Form Group', () => {
    form.addField('users', {
      name: {
        value: null,
        validator: ['required'],
      },
      email: {
        value: 'invalid email',
        validator: ['email'],
      }
    });
    let { form: fields } = form.value();
    expect(fields.users[1].email.value).toBe('invalid email');
  });
});

describe('Update Form Group', () => {
  test('Remove Fields', () => {
    form.removeField('email');
    form.removeField('emailConfirmation');
    let { form: fields } = form.value();
    expect(fields.email).toBeUndefined();
    expect(fields.emailConfirmation).toBeUndefined();
  });

  test('Update Form Group', () => {
    form.update('users', Form.group(0, { name: 'John Doe', email: 'john@mail.com' }));
    form.update('users', Form.group(1, { name: 'Jane', email: 'jane@mail.com' }));
    let { form: fields } = form.value();
    expect(fields.users[0].name.value).toBe('John Doe');
    expect(fields.users[0].email.value).toBe('john@mail.com');
    expect(fields.users[1].name.value).toBe('Jane');
    expect(fields.users[1].email.value).toBe('jane@mail.com');
  });

  test('Validate Form', () => {
    let { valid } = form.value();
    expect(valid).toBe(true);
  });
});
