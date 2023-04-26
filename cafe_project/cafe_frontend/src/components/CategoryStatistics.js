import React, {useEffect, useState} from 'react';
import CafeService from './CafeService';
import {useLocation, useNavigate, useSearchParams} from "react-router-dom";

const cafeService = new CafeService();


export default function CategoryStatistics() {

    const [mealCategories, setMealCategories] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [categoryTopUsers, setCategoryTopUsers] = useState([]);
    const [category, setCategory] = useState('unknown');
    const [meals, setMeals] = useState([]);
    const [access, setAccess] = useState(localStorage.getItem('accessToken'));
    const [isUnknown, setIsUnknown] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();


    useEffect(() => {
        cafeService.getMenu().then(function (result) {
            console.log(result);
            setMealCategories(result);
        })
    }, []);


    useEffect(() => {
        if (searchParams.get("meal_category")) {
            mealCategories.map((category) => {
                category[1] === searchParams.get("meal_category") && setCategory(category[0]);
                console.log(category[0]);
                console.log(category[1])
            });
            cafeService.getMealCategory(searchParams.get("meal_category")).then(function (result) {
                console.log(result);
                setMeals(result);
            });
        }
    }, [searchParams, mealCategories]);


    useEffect(() => {
        if (searchParams.get("meal_category")) {
            cafeService.getCategoryTopUsers(searchParams.get("meal_category"), access).then(function (result) {
                console.log(result);
                if (result) {
                    if (result.access) {
                        localStorage.setItem('accessToken', result.access);
                        setAccess(result.access);
                        localStorage.setItem('refreshToken', result.refresh);
                    } else {
                        searchParams.get("user_count") ? setCategoryTopUsers(result.slice(0, searchParams.get("user_count")))
                            : setCategoryTopUsers(result);
                    }
                } else {
                    navigate('/login', {replace: true, state: {from: location}});
                }
            })
        }
    }, [searchParams, access]);


    const onChange = (e) => {
        e.target.value !== 'unknown' ? setIsUnknown(false) : setIsUnknown(true)
    }

    return (
        <div className='statistics'>
            <div className='users-category'>
                <h3>Здесь можно посмотреть список наиболее активных пользователей в разрезе категорий
                    блюд</h3>
                <form>
                    <label>
                        Сколько пользователей вывести:
                        <input type="number" name="user_count"/>
                    </label><br/><br/>
                    <label>
                        Интересующая категория блюд:
                        <select name="meal_category" onChange={onChange}>
                            <option value='unknown'>-----------------------</option>
                            {mealCategories.map((category, index) =>
                                <option key={index} value={category[1]} label={category[0]}>{category[0]}</option>
                            )}
                        </select>
                    </label><br/><br/>
                    <button className='btn' type="submit" disabled={isUnknown}>Посмотреть</button>
                </form>
            </div>
            {categoryTopUsers.length &&
                <div className='users-category-output'>
                    <h3 className='title'>Статистика по выбранной категории "{category}"</h3>
                    <div className='row'>
                        <div className="col-md-7">
                            <div className='top-users'>
                                <h3>Топ активных пользователей</h3>
                                <table>
                                    <thead>
                                    <tr>
                                        <th></th>
                                        <th>Имя пользователя</th>
                                        <th>Количество переходов</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {categoryTopUsers.map((user, index) =>
                                        <tr key={index}>
                                            <td className='ind'>{index + 1}</td>
                                            <td className='value'>{user.username}</td>
                                            <td className='value'
                                                style={{textAlign: "center"}}>{user.user_click_count}</td>
                                        </tr>)}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="col-md-5">
                            <div className='charts-list'>
                                <h4>Ссылки на графики по блюдам категории</h4>
                                <div className='charts-links'>
                                    {meals.map((meal) =>
                                        <button className='btn' key={meal.id}
                                                onClick={() => navigate(`/meal_statistics/${meal.id}`)}>{meal.name}</button>)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}