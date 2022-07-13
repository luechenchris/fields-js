import Form from '../index';

let form = new Form({
  email: {
    value: null,
    validator: ['email'],
  }
});

describe('Form Validation', () => {
  test('Valid Email', () => {
    form.update('email', 'johndoe@gmail.com');
    let { valid } = form.value();
    expect(valid).toBe(true);
  });

  test('Invalid Email', () => {
    form.update('email', 'johndoegmail.com');
    let { valid, form: fields } = form.value();
    expect(valid).toBe(false);
    expect(fields.email.value).toBe('johndoegmail.com');
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
  beforeAll(() => {
    // Remove email field
    form.removeField('email');
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
