import {useLocation, useNavigate} from 'react-router-dom'
import {useAuth} from "../hook/useAuth";
import CafeService from "./CafeService";
import {useState} from "react";

const cafeService = new CafeService();


const Login = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const {signIn} = useAuth();
    const fromPage = location.state?.from?.pathname || '/';
    const [error, setError] = useState()

    const HandleSubmit = (event) => {
        event.preventDefault();
        const form = event.target;
        const user = form.username.value;
        const password = form.password.value;
        cafeService.getTokens(user, password).then(function (result) {
            console.log(result);
            cafeService.getUser(result.access).then(function (res) {
                console.log(res);
                signIn(user, result.access, result.refresh, res.id, () =>
                    navigate(fromPage==='/registration' ? `/` : fromPage, {replace: true}))
                console.log(res.id)
            })
        }).catch((error) => {error.response.data.detail==="No active account found with the given credentials" &&
        setError("Профиль с такими учетными данными не существует")})
    }

    return (
        <div>
            <main className="form-signin m-auto">
                <form onSubmit={HandleSubmit}>
                    <h2>Авторизуйтесь или <a href="/cafe_project /cafe_frontend/src/components/Registration">зарегистрируйтесь</a></h2>
                    {error && <p className="error">{error}</p>}
                    <div className="form-floating">
                        <input className="form-control" name='username' placeholder="Имя пользователя"/>
                    </div>
                    <div className="form-floating">
                        <input type="password" className="form-control" autoComplete="new-password" name='password' placeholder="Пароль"/>
                    </div>
                    <button className="w-100 btn btn-success" type="submit">Войти</button>
                </form>
            </main>
        </div>
    );
}

export {Login}