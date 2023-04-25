import { JwtPayload } from 'jwt-decode';
export default interface JwtCustomInterface extends JwtPayload{
    groups: string[];
    user_id: number;
}