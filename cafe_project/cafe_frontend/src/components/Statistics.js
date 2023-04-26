import React, {useEffect, useState} from 'react';
import CafeService from './CafeService';
import {useLocation, useNavigate} from "react-router-dom";

const cafeService = new CafeService();


export default function Statistics() {

    const [topMeals, setTopMeals] = useState([]);
    const [topUsers, setTopUsers] = useState([]);
    const [access, setAccess] = useState(localStorage.getItem('accessToken'));
    const navigate = useNavigate();
    const location = useLocation();


    useEffect(() => {
        cafeService.getTopMeals(access).then(function (result) {
            console.log(result);
            if (result) {
                if (result.access) {
                    localStorage.setItem('accessToken', result.access);
                    setAccess(result.access);
                    localStorage.setItem('refreshToken', result.refresh);
                } else {
                    setTopMeals(result.slice(0, 3));
                }
            } else {
                navigate('/login', {replace: true, state: {from: location}});
            }
        });
        cafeService.getTopUsers(access).then(function (result) {
            console.log(result);
            if (result) {
                if (result.access) {
                    localStorage.setItem('accessToken', result.access);
                    setAccess(result.access);
                    localStorage.setItem('refreshToken', result.refresh);
                } else {
                    setTopUsers(result.slice(0, 10));
                }
            } else {
                navigate('/login', {replace: true, state: {from: location}});
            }
        });
    }, [access]);


    return (
        <div className='statistics'>
            <div className='top-meals'>
                <h3>Топ 3 наших блюда</h3>
                <table>
                    <thead>
                    <tr>
                        <th></th>
                        <th>Название блюда</th>
                        <th>Количество переходов</th>
                    </tr>
                    </thead>
                    <tbody>
                    {topMeals.map((meal, index) =>
                        <tr key={meal.id}>
                            <td className='ind'>{index + 1}</td>
                            <td className='value'>{meal.name}</td>
                            <td className='value' style={{textAlign: "center"}}>{meal.click_count}</td>
                        </tr>)}
                    </tbody>
                </table>
            </div>
            <div className='top-users'>
                <h3>Топ 10 активных пользователей</h3>
                <table>
                    <thead>
                    <tr>
                        <th></th>
                        <th>Имя пользователя</th>
                        <th>Количество переходов</th>
                    </tr>
                    </thead>
                    <tbody>
                    {topUsers.map((user, index) =>
                        <tr key={user.id}>
                            <td className='ind'>{index + 1}</td>
                            <td className='value'>{user.username}</td>
                            <td className='value' style={{textAlign: "center"}}>{user.user_click_count}</td>
                        </tr>)}
                    </tbody>
                </table>
            </div>
        </div>
    );
}