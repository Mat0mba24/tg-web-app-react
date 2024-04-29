import './App.css';
import { useEffect } from 'react';
import { useTelegram } from './hooks/useTelegram';
import { Route, Routes } from 'react-router-dom';
import SaleApartmentForm from "./components/SaleApartmentForm/SaleApartmentForm";
import RentApartmentForm from "./components/RentApartmentForm/RentApartmentForm";

function App() {
	const { tg } = useTelegram();

	useEffect(() => {
		tg.ready();
	})

	return (
		<div className="App">
			work
			<Routes>
				<Route path={'sale_apartment_form'} element={<SaleApartmentForm />} />
				<Route path={'rent_apartment_form'} element={<RentApartmentForm />} />
			</Routes>
		</div>
	);
}

export default App;
