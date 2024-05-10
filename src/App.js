import './App.css';
import { useEffect } from 'react';
import { useTelegram } from './hooks/useTelegram';
import { Route, Routes } from 'react-router-dom';
import ApartmentForm from "./components/ApartmentForm/ApartmentForm";
import HouseForm from "./components/HouseForm/HouseForm";

function App() {
	const { tg } = useTelegram();

	useEffect(() => {
		tg.ready();
	}, [tg])

	return (
		<div className="App">
			<Routes>
				<Route path={'apartment_form'} element={<ApartmentForm />} />
				<Route path={'house_form'} element={<HouseForm />} />
			</Routes>
		</div>
	);
}

export default App;
