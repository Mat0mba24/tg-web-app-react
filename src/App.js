import './App.css';
import { useEffect } from 'react';
import { useTelegram } from './hooks/useTelegram';
import Header from "./components/Header/Header";
import { Route, Routes } from 'react-router-dom';
import ApartmentForm from "./components/ApartmentForm/ApartmentForm";

function App() {
	const { tg } = useTelegram();

	useEffect(() => {
		tg.ready();
	}, [])

	return (
		<div className="App">
			<Routes>
				<Route path={'apartment_form'} element={<ApartmentForm />} />
			</Routes>
		</div>
	);
}

export default App;
