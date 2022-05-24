import { Auth } from 'aws-amplify'

export async function signIn(email, password) {
    try {
        const user = await Auth.signIn(email, password);
        return user;
    } catch (error) {
        console.log('error signing in', error);
    }
}

export async function signUp(email, password) {
    try {
        const { user } = await Auth.signUp({
            username: email,
            password,
            attributes: {
                email
            }
        });
        console.log(user);
    } catch (error) {
        console.log('error signing up:', error);
    }
}