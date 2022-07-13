import Form from '../index';

const fields = {
  email: {
    value: null,
    validator: ['email'],
  },
  emailConfirmation: {
    value: null,
    validator: (text: string) => {
      return text == 'johndoe@gmail.com';
    },
  },
};

const form = new Form(fields);

describe('Form Validation', () => {
  test('Invalid Field', () => {
    form.updateAll({
      email: 'johndoegmail.com',
      emailConfirmation: null,
    });
    const { form: fields } = form.value();
    expect(fields.email.valid).toBe(false);
    expect(fields.email.touched).toBe(true);
    expect(fields.emailConfirmation.valid).toBe(false);
  });

  test('Valid Field', () => {
    form.update('email', 'johndoe@gmail.com');
    form.update('emailConfirmation', 'johndoe@gmail.com');
    const { form: fields } = form.value();
    expect(fields.email.valid).toBe(true);
    expect(fields.email.pristine).toBe(false);
    expect(fields.emailConfirmation.valid).toBe(true);
  });

  test('Valid Form', () => {
    const { valid } = form.value();
    expect(valid).toBe(true);
  });
});

describe('Adding Fields To Form', () => {
  test('Add Form Group', () => {
    form.addField('users', [
      {
        name: {
          value: null,
          validator: null,
        },
        email: {
          value: null,
          validator: ['email'],
        },
      },
    ]);
    const { form: fields } = form.value();
    expect(fields.users[0].name.value).toBeNull();
    expect(fields.users[0].name.valid).toBe(true);
  });

  test('Add Field To Form Group', () => {
    form.addField('users', {
      name: {
        value: null,
        validator: [new RegExp("^[a-zA-Z'-]+$")],
      },
      email: {
        value: 'invalid email',
        validator: ['email'],
      },
    });
    const { form: fields } = form.value();
    expect(fields.users[1].email.value).toBe('invalid email');
  });

  test('Update Field Validator', () => {
    form.updateAll({ users: Form.group(0, { name: { value: '', validator: 'required' } }) });
    const { form: fields } = form.value();
    expect(fields.users[0].name.valid).toBe(false);
  });
});

describe('Modify Form Group', () => {
  test('Update Form Group', () => {
    form.update(
      'users',
      Form.group(0, { name: 'John Doe', email: 'john@mail.com' })
    );
    form.update(
      'users',
      Form.group(1, { name: 'Jane', email: 'jane@mail.com' })
    );
    const { form: fields } = form.value();
    expect(fields.users[0].name.value).toBe('John Doe');
    expect(fields.users[0].email.value).toBe('john@mail.com');
    expect(fields.users[1].name.value).toBe('Jane');
    expect(fields.users[1].email.value).toBe('jane@mail.com');
  });

  test('Remove Fields', () => {
    form.removeField('emailConfirmation');
    form.removeField('users', 1);
    const { form: fields } = form.value();
    expect(fields.emailConfirmation).toBeUndefined();
    expect(fields.users[1]).toBeUndefined();
  });

  test('Valid Form', () => {
    const { valid } = form.value();
    expect(valid).toBe(true);
  });
});

describe('Reset Form', () => {
  test('Reset All Fields', () => {
    form.resetAll();
    const { valid, form: fields } = form.value();
    expect(valid).toBe(false);
    expect(fields.email.value).toBe('');
  });

  test('Hydrate Fields', () => {
    const values = {
      email: {
        value: 'invalidemail',
        validator: ['email'],
      },
      users: [
        {
          name: {
            value: 'Jake',
            validator: 'required',
          },
          email: {
            value: 'jake@mail.com',
            validator: ['email'],
          },
        },
        {
          name: {
            value: 'Matthew',
            validator: 'required',
          },
          email: {
            value: 'matthew@mail.com',
            validator: ['email'],
          },
        }
      ]
    };
    form.hydrate(values);
    const { valid, form: fields } = form.value();
    expect(fields.email.value).toBe('invalidemail');
    expect(fields.users[0].email.value).toBe('jake@mail.com');
    expect(fields.users[1].name.value).toBe('Matthew');
    expect(valid).toBe(false);
  });
});