import { Resend } from 'resend';
console.log(process.env.RESEND_API_KEY, "reesne api keey ");
const resend = new Resend(process.env.RESEND_API_KEY);
// console.log(resend);

export default resend;