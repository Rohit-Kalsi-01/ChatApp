import jwt from 'jsonwebtoken'

export const generateToken = (id) => {
    const token = jwt.sign({ id }, process.env.JWT_SECRET);
    return token;
}