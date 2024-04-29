import React, { useState, useEffect } from "react";
import './SaleApartmentForm.css';
import { useTelegram } from "../../hooks/useTelegram";

const SaleApartmentForm = () => {
	const [country, setCountry] = useState('');
	const [street, setStreet] = useState('');
	const [subject, setSubject] = useState('physical');
	const { tg } = useTelegram();

	useEffect(() => {
		tg.MainButton.setParams({
			text: 'Отправить данные'
		})
	}, [])

	useEffect(() => {
		if (!country || !street) {
			tg.MainButton.hide();
		} else {
			tg.MainButton.show();
		}
	}, [country, street])

	const onChangeCountry = (e) => {
		setCountry(e.target.value);
	}

	const onChangeStreet = (e) => {
		setStreet(e.target.value);
	}

	const onChangeSubject = (e) => {
		setSubject(e.target.value);
	}

	return (
		<div className={"form"}>
			<h3>Введите ваши данные для ПРОДАЖИ квартиры:</h3>
			<input
				className={"input"}
				type="text"
				placeholder={'Страна'}
				value={country}
				onChange={onChangeCountry}
			/>
			<input
				className={"input"}
				type="text"
				placeholder={'Улица'}
				value={street}
				onChange={onChangeStreet}
			/>
			<select value={subject} onChange={onChangeSubject} className={"select"}>
				<option value={"legal"}>Юр. лицо</option>
				<option value={"physical"}>Физ. лицо</option>
			</select>
		</div>
	);
};

export default SaleApartmentForm;