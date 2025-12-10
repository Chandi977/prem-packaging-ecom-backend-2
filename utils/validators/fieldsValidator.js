exports.validateSignup = (fields) => {
  if (
    !fields.first_name ||
    !fields.last_name ||
    !fields.email_address ||
    !fields.password
  ) {
    return false;
  }
  return true;
};

exports.validateSignin = (fields) => {
  if (!fields.email_address || !fields.password) {
    return false;
  }
  return true;
};

exports.validateCategory = (fields) => {
  if (!fields.name || !fields.category_id) {
    return false;
  }
  return true;
};

exports.validateBrand = (fields) => {
  if (!fields.name || !fields.brand_id) {
    return false;
  }
  return true;
};

exports.validateNotify = (fields) => {
  if (!fields.name || !fields.product_id) {
    return false;
  }
  return true;
};

exports.validateCoupon = (fields) => {
  if (!fields.name ) {
    return false;
  }
  return true;
};

exports.validateSubCategory = (fields) => {
  if (!fields.name || !fields.sub_category_id || !fields.category) {
    return false;
  }
  return true;
};

exports.validateProduct = (fields) => {
  if (
    !fields.brand ||
    !fields.name ||
    !fields.meta_title ||
    !fields.meta_description ||
    !fields.category
  ) {
    return false;
  }
  return true;
};
