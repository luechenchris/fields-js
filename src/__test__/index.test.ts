import Form from '../index';

test('Valid Email', () => {
  let form = new Form({
    email: {
      value: null,
      validator: ['email'],
    }
  });
  form.update('email', 'johndoe@gmail.com');
  let { valid } = form.value();
  expect(valid).toBe(true);
});

test('Invalid Email', () => {
  let form = new Form({
    email: {
      value: null,
      validator: ['email'],
    }
  });
  form.update('email', 'johndoegmail.com');
  let { valid } = form.value();
  expect(valid).toBe(false);
});