import {useLocation, useNavigate} from 'react-router-dom'
import CafeService from "./CafeService";
import React, {useState} from "react";
import {useForm} from "react-hook-form";

const cafeService = new CafeService();


const Registration = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const {register, formState: {errors, isValid}, handleSubmit, watch} = useForm({mode: "onBlur"})
    const watchPassword = watch("password")

    const [error, setError] = useState()

    const onSubmit = (data) => {
        delete data['password2'];
        cafeService.createUser(data).then(r => {
            // modal();
            navigate('/login', {replace: true, state: {from: location}})
        }).catch((error)=> {
            error.response.data.username && error.response.data.username[0]==="Пользователь с таким именем уже существует." &&
            setError(error.response.data.username[0]);
        })
    }


    return (
        <div>
            <main className="form-register m-auto">
                <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                    <h2>Регистрация здесь</h2>
                    {error && <p className="error">{error}</p>}
                    <div className="form-floating">
                        <input className="form-control" placeholder="Имя пользователя латиницей"
                            {...register("username", {
                                    required: "Поле обязательно к заполнению",
                                    maxLength: {value: 20, message: "Максимум 20 символов"},
                                    minLength: {value: 2, message: "Минимум 2 символа"},
                                    pattern: {
                                        value: /^[a-zA-Z0-9]+$/,
                                        message: "Поле может содержать только латинские буквы и цифры"
                                    }})}/>
                        {errors?.username &&
                             <div className="error">
                                  <p>{errors.username.message}</p>
                             </div>}
                    </div>
                    <div className="form-floating">
                        <input type="password" className="form-control" autoComplete="new-password" placeholder="Пароль"
                            {...register("password", {
                                    required: "Поле обязательно к заполнению",
                                    minLength: {value: 8, message: "Минимум 8 символов"},
                                    pattern: {
                                        value: /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
                                        message: "Пароль должен содержать хотя бы одну цифру, строчную и заглавную латинскую букву"
                                    }})}/>
                        {errors?.password &&
                             <div className="error">
                                  <p>{errors.password.message}</p>
                             </div>}
                    </div>
                    <div className="form-floating">
                        <input type="password" className="form-control" autoComplete="new-password" placeholder="Подтвердите пароль"
                            {...register("password2", {
                                    required: "Поле обязательно к заполнению",
                                    validate: value=>value === watchPassword
                                    })}/>
                        {errors?.password2 &&
                             <div className="error">
                                  <p>{errors?.password2?.message || 'Введен неверный пароль'}</p>
                             </div>}
                    </div>
                    <button className="w-100 btn btn-success" type="submit" disabled={!isValid}>Зарегистрироваться</button>
                </form>
            </main>
        </div>
    );
}

export default Registration;
