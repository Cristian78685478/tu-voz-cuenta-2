import crypto from 'node:crypto';
const COOKIE='tvc_admin';
function token(password){return crypto.createHmac('sha256',password).update('tu-voz-cuenta-admin-v2').digest('base64url')}
export function setAdminCookie(res){const password=process.env.ADMIN_PASSWORD;if(!password)throw new Error('Falta ADMIN_PASSWORD.');res.setHeader('Set-Cookie',`${COOKIE}=${token(password)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=28800`)}
export function clearAdminCookie(res){res.setHeader('Set-Cookie',`${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`)}
export function isAdmin(req){const password=process.env.ADMIN_PASSWORD;if(!password)return false;const match=(req.headers.cookie||'').match(new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]+)`));if(!match)return false;const a=Buffer.from(token(password)),b=Buffer.from(match[1]);return a.length===b.length&&crypto.timingSafeEqual(a,b)}