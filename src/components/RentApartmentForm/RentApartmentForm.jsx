import { useState, useEffect, useCallback } from 'react';
import './RentApartmentForm.css';
import { useTelegram } from '../../hooks/useTelegram';

const RentApartmentForm = () => {
	const [address, setAddress] = useState('');
	const [environment, setEnvironment] = useState([]);
	const [infrastructure, setInfrastructure] = useState([]);
	const [typeOfHouse, setTypeOfHouse] = useState(0);
	const [selectedFiles, setSelectedFiles] = useState([]);
	const [previewUrls, setPreviewUrls] = useState([]);
	const { tg, user, queryId } = useTelegram();

	const onSendData = useCallback(() => {
		// Создаем новый объект FormData
		const formData = new FormData();

		// Добавляем данные формы
		formData.append('address', address);
		formData.append('environment', JSON.stringify(environment));
		formData.append('infrastructure', JSON.stringify(infrastructure));
		formData.append('typeOfHouse', typeOfHouse);
		// Добавляем userId
		formData.append('userId', user.id);
		// Добавляем queryId
		formData.append('queryId', queryId);
		// Добавляем фотографии
		selectedFiles.forEach(file => {
			formData.append('photos', file);
		});

		// Отправляем запрос на сервер
		fetch('https://mat0m6a.ru/form_data', {
			method: 'POST',
			body: formData // Теперь отправляем formData вместо JSON
		})
	}, [address, environment, infrastructure, typeOfHouse, selectedFiles, queryId]);

	useEffect(() => {
		tg.onEvent('mainButtonClicked', onSendData)
		return () => {
			previewUrls.forEach(URL.revokeObjectURL);
			tg.offEvent('mainButtonClicked', onSendData)
		}
	}, [onSendData])

	useEffect(() => {
		tg.MainButton.setParams({
			text: 'Отправить данные'
		})
	}, [])

	useEffect(() => {
		if (!address || !environment || !infrastructure || selectedFiles.length == 0) {
			tg.MainButton.hide();
		} else {
			tg.MainButton.show();
		}
	}, [address, environment, infrastructure, selectedFiles])

	const onChangeAddress = (e) => {
		setAddress(e.target.value);
	}

	const onChangeEnvironment = (e) => {
		setEnvironment(Array.from(e.target.selectedOptions, option => option.value));
	}

	const onChangeInfrastructure = (e) => {
		setInfrastructure(Array.from(e.target.selectedOptions, option => option.value));
	}

	const onChangeTypeOfHouse = (e) => {
		setTypeOfHouse(e.target.value);
	}

	// Обработчик изменений input
	const onFilesChange = (event) => {
		// Если количество файлов вместе с уже выбранными не превышает 10
		if (event.target.files.length + selectedFiles.length <= 10) {
			// Создаем массив файлов из FileList
			const filesArray = Array.from(event.target.files);
			// Обновляем состояние добавлением новых файлов
			setSelectedFiles(prevFiles => [...prevFiles, ...filesArray]);
			// Создаем превью URL для каждого нового файла
			const newPreviewUrls = filesArray.map(file => URL.createObjectURL(file));
			// Обновляем состояние превью URL
			setPreviewUrls(prevUrls => [...prevUrls, ...newPreviewUrls]);
		} else {
			alert('Вы можете загрузить не более 10 фотографий.');
		}
	};

	// Обработчик удаления файла и его превью из списка
	const removeFile = (index) => {
		// Освобождаем URL превью
		URL.revokeObjectURL(previewUrls[index]);
		// Удаляем файл и URL превью из состояния
		setSelectedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
		setPreviewUrls(prevUrls => prevUrls.filter((_, i) => i !== index));
	};

	const environmentObjects = [
		{ environment_id: 0, environment_name: 'Лес' },
		{ environment_id: 1, environment_name: 'Парк' },
		{ environment_id: 2, environment_name: 'Водоём' }
	];

	const infrastructureObjects = [
		{ infrastructure_id: 0, infrastructure_name: 'Дет. сад' },
		{ infrastructure_id: 1, infrastructure_name: 'Школа' },
		{ infrastructure_id: 2, infrastructure_name: 'Больница' },
		{ infrastructure_id: 3, infrastructure_name: 'Транспортная доступность' },
		{ infrastructure_id: 4, infrastructure_name: 'Торговые центры' }
	];

	const typesOfHouseObjects = [
		{ type_id: 0, type_name: 'Панельный' },
		{ type_id: 1, type_name: 'Кирпичный' },
		{ type_id: 2, type_name: 'Монолитный' }
	];

	return (
		<div className={"form"}>
			<h1><u>ЛИСТ ОСМОТРА КВАРТИРЫ</u></h1>
			<input
				className={"input"}
				type="text"
				placeholder={'Адрес'}
				value={address}
				onChange={onChangeAddress}
			/>
			<h2><u>Характеристика района:</u></h2>
			<select multiple value={environment} onChange={onChangeEnvironment} className={"select"}>
				{environmentObjects.map((env) => (
					<option value={env.environment_id}>{env.environment_name}</option>
				))}
			</select>
			<select multiple value={infrastructure} onChange={onChangeInfrastructure} className={"select"}>
				{infrastructureObjects.map((inf) => (
					<option value={inf.infrastructure_id}>{inf.infrastructure_name}</option>
				))}
			</select>
			<h2><u>Характеристики объекта:</u></h2>
			<select value={typeOfHouse} onChange={onChangeTypeOfHouse} className={"select"}>
				{typesOfHouseObjects.map((type) => (
					<option value={type.type_id}>{type.type_name}</option>
				))}
			</select>
			<h2><u>Изображения:</u></h2>
			<input
				type="file"
				multiple
				onChange={onFilesChange}
			/>
			{selectedFiles.map((file, index) => (
				<div key={index}>
					<img src={previewUrls[index]} alt="Preview" style={{ width: '100px', height: '100px' }} />
					<span>{file.name}</span>
					<button type="button" onClick={() => removeFile(index)}>Удалить</button>
				</div>
			))}
		</div>
	);
};

export default RentApartmentForm;