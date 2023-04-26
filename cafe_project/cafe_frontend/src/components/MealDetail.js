import React, {useEffect, useState} from 'react';
import {Navigate, useLocation, useNavigate, useParams} from "react-router-dom";
import CafeService from './CafeService';


const cafeService = new CafeService();


function MealDetail() {

    const [meal, setMeal] = useState({});
    const {id, meal_category} = useParams();
    const [access, setAccess] = useState(localStorage.getItem('accessToken'));
    const navigate = useNavigate();
    const location = useLocation();



    useEffect(() => {
        cafeService.getMealInCategory(meal_category, id, access).then(function (result) {
            console.log(result);
            if (result) {
                if (result.access) {
                    localStorage.setItem('accessToken', result.access);
                    setAccess(result.access);
                    localStorage.setItem('refreshToken', result.refresh);
                } else {
                    setMeal(result);
                }
            } else {
                navigate('/login', {replace: true, state: {from: location}});
            }
        })
    }, [id, access]);


    return (
        <div className='meal-detail' key={meal.id}>
            <h2 className='meal-name'>{meal.name}</h2>
            <div className="row">
                {meal.photos?.length > 1
                    ? <div className="col-md-6">
                        <scroll-container>
                            {meal.photos.map((photo, index) =>
                                <scroll-img key={index} >
                                    <img src={photo.image}
                                         className="img-fluid rounded-start" alt="..."/>
                                </scroll-img>)}
                        </scroll-container>
                    </div>
                    : <div className="col-md-6">
                        <scroll-img>
                            <img width={250} height={250}
                                 src={meal.photos?.length === 1 ? meal.photos[0].image : "/img/No_photo.png"}
                                 className="img-fluid rounded-start" alt="..."/>
                        </scroll-img>
                    </div>}

                <div className="col-md-6">
                    <div className='description'>
                        <h2>{meal.price} р.</h2>
                        <p><i>Размер порции:</i> {meal.size} г</p>

                        <h5>Описание:</h5>
                        <p>{meal.description}</p>
                        <a className='stat-link' href={`/meal_statistics/${meal.id}`}>Статистика</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MealDetail;
