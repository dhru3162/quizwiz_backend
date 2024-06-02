
const PASSWORD_PATTERN = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

const EMAIL_PATTERN = /^[a-z0-9._-]+@[a-z0-9-]+\.[a-z]{2,4}$/i;

module.exports = {
    PASSWORD_PATTERN,
    EMAIL_PATTERN,
};