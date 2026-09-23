const { validatePasswordStrength } = require('./password');

describe('validatePasswordStrength', () => {
    it('should return valid for a strong password', () => {
        const result = validatePasswordStrength('StrongPass123!');
        expect(result.valid).toBe(true);
    });

    it('should return invalid if password is less than 8 characters', () => {
        const result = validatePasswordStrength('Short1!');
        expect(result.valid).toBe(false);
        expect(result.message).toBe('Password must be at least 8 characters long');
    });

    it('should return invalid if password has no uppercase letter', () => {
        const result = validatePasswordStrength('weakpass123!');
        expect(result.valid).toBe(false);
        expect(result.message).toBe('Password must contain at least one uppercase letter');
    });

    it('should return invalid if password has no lowercase letter', () => {
        const result = validatePasswordStrength('WEAKPASS123!');
        expect(result.valid).toBe(false);
        expect(result.message).toBe('Password must contain at least one lowercase letter');
    });

    it('should return invalid if password has no numbers', () => {
        const result = validatePasswordStrength('StrongPass!');
        expect(result.valid).toBe(false);
        expect(result.message).toBe('Password must contain at least one number');
    });

    it('should return invalid if password has no special character', () => {
        const result = validatePasswordStrength('StrongPass123');
        expect(result.valid).toBe(false);
        expect(result.message).toBe('Password must contain at least one special character');
    });
});
