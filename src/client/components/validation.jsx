// Use Object.assign or any similar API to merge a rules
// NOTE: IE10 doesn't have Object.assign API natively. Use polyfill/babel plugin.
objectAssign(Validation.rules, {
  // Key name maps the rule
  required: {
    // Function to validate value
    // NOTE: value might be a number -> force to string
    rule: value => {
      return value.toString().trim();
    },
    // Function to return hint
    // You may use current value to inject it in some way to the hint
    hint: value => {
      return <div className='form-error is-visible'>Required</div>
    }
  },
  email: {
    // Example usage with external 'validator'
    rule: value => {
      return validator.isEmail(value);
    },
    hint: value => {
      return <div className='form-error is-visible'>Invalid email</div>
    }
  },
  number: {
    // Example usage with external 'validator'
    rule: value => {
      return validator.isNumeric(value);
    },
    hint: value => {
      return <div className='form-error is-visible'>Invalid number</div>
    }
  }
});
