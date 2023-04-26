import React, {useEffect, useState} from 'react';
import CafeService from './CafeService';
import {useLocation, useNavigate, useParams, useSearchParams} from "react-router-dom";
import {
    Chart,
    ChartSeries,
    ChartSeriesItem,
    ChartCategoryAxis,
    ChartCategoryAxisItem,
    ChartTitle,
    ChartValueAxis,
    ChartValueAxisItem,
    ChartArea
} from "@progress/kendo-react-charts";
import "hammerjs";
import IsAuthControl from "./IsAuthControl";

const cafeService = new CafeService();


export default function MealChart() {

    const {id} = useParams();
    const [meal, setMeal] = useState({});
    const [data, setData] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [access, setAccess] = useState(localStorage.getItem('accessToken'));
    const navigate = useNavigate();
    const location = useLocation();


    useEffect(() => {
        cafeService.getMeal(id).then(function (result) {
            console.log(result);
            setMeal(result);
        });
    }, [id]);

    useEffect(() => {
        const period = searchParams.get("period");
        const num = searchParams.get("num");
        cafeService.getMealData(id, period, num, access).then(function (result) {
            console.log(result);
            // IsAuthControl(result) && (IsAuthControl(result).access ? setAccess(result.access) : setData(result));

            if (result) {
                if (result.access) {
                    localStorage.setItem('accessToken', result.access);
                    setAccess(result.access);
                    localStorage.setItem('refreshToken', result.refresh);
                } else {
                    setData(result);
                }
            } else {
                navigate('/login', {replace: true, state: {from: location}});
            }
        });
    }, [id, searchParams, access]);


    const ChartContainer = () => (
        <Chart className='chart'>
            <ChartArea background="cafe_project /cafe_frontend/src/components#eee" margin={30} width={1000} height={700}/>
            <ChartTitle text={meal.name} color="green" font="28pt Montserrat"/>
            <ChartValueAxis>
                <ChartValueAxisItem
                    title={{
                        text: "Число переходов",
                        color: "green",
                        font: "20pt Montserrat"
                    }}
                    labels={{
                        color: 'black',
                        padding: 3,
                    }}
                    majorGridLines={{color: '#388135'}}
                    line={{color: 'black'}}
                    min={0}
                    // max={5}
                />
            </ChartValueAxis>
            <ChartCategoryAxis>
                <ChartCategoryAxisItem
                    maxDivisions={18}
                    labels={{
                        color: 'black',
                        rotation: "auto",
                        maxDivisions: 18
                    }}
                    line={{color: 'black'}}
                />
            </ChartCategoryAxis>
            <ChartSeries>
                <ChartSeriesItem
                    data={data}
                    type="column"
                    field="click_count"
                    categoryField="date"
                    color="rgba(252, 218, 137, 0.87)"                />
            </ChartSeries>
        </Chart>
    );

    return (
        <div className='meal-statistics'>
            <ChartContainer/>
            <h3>Здесь можно выбрать параметры статистического обзора</h3>
            <form>
                <label>
                    Периодичность  наблюдений:
                    <select name="period">
                        <option>Дни</option>
                        <option>Часы</option>
                        <option>Недели</option>
                        <option>Месяцы</option>
                    </select>
                </label><br/>
                <label>
                    Продолжительность периода:
                    <input type="number" name="num"/>
                </label><br/><br/>
                <button type="submit">Посмотреть</button>
            </form>
        </div>
    );
}