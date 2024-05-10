import { useState, useEffect, useCallback } from 'react';
import './ApartmentForm.css';
import { useTelegram } from '../../hooks/useTelegram';
import SelectOrInput from '../SelectOrInput/SelectOrInput';

const ApartmentForm = () => {
	const initialState = {
		address: '',
		cost: '',
		cadastralNumber: '',
		environment: [],
		environmentText: '',
		infrastructure: [],
		infrastructureText: '',
		typeOfHouse: [],
		typeOfHouseText: '',
		classOfHouse: [],
		classOfHouseText: '',
		yearBuilt: '',
		entranceCondition: [],
		entranceConditionText: '',
		floorsCount: '',
		floorNumber: '',
		roomsCount: '',
		apartmentCondition: [],
		repair: [],
		repairText: '',
		squareTotal: '',
		squareLiving: '',
		squareKitchen: '',
		layout: [],
		layoutText: '',
		bathroom: [],
		bathroomСount: '',
		kitchen: [],
		kitchenText: '',
		glassPane: [],
		glassPaneText: '',
		furniture: [],
		furnitureText: '',
		redevelopment: [],
		redevelopmentText: '',
		nuances: '',
		notes: '',
		mortgage: [],
		hasBalcony: [],
		typeOfSale: []
	};
	
	const [state, setState] = useState(initialState);
	const [selectedFiles, setSelectedFiles] = useState([]);
	const { tg, user, queryId } = useTelegram();

	const onSendData = useCallback(() => {
    // Создаем новый объект FormData
    const formData = new FormData();

    // Добавляем данные формы
    Object.entries(state).forEach(([key, value]) => {
        if (Array.isArray(value)) {
						if (value.length > 0)
            	formData.append(key, JSON.stringify(value));
        } else {
						if (value !== '')
            	formData.append(key, value);
        }
    });

    // Добавляем userId
    formData.append('userId', user.id);
    // Добавляем queryId
    formData.append('queryId', queryId);
    // Добавляем фотографии
    selectedFiles.forEach(fileObj => {
        formData.append('photos', fileObj.file); // Теперь отправляем только файл
    });

    // Отправляем запрос на сервер
    fetch('https://mat0m6a.ru/apartment_form_data', {
        method: 'POST',
        body: formData // Теперь отправляем formData вместо JSON
    })
	}, [user, state, selectedFiles, queryId]);
	
	useEffect(() => {
			tg.onEvent('mainButtonClicked', onSendData)
			return () => {
					selectedFiles.forEach(fileObj => URL.revokeObjectURL(fileObj.previewUrl));
					tg.offEvent('mainButtonClicked', onSendData)
			}
	}, [tg, onSendData, selectedFiles]);

	useEffect(() => {
		tg.MainButton.setParams({
			text: 'Отправить данные'
		})
	}, [tg])

	useEffect(() => {
		if (!state.address || !state.cost || !state.cadastralNumber) {
			tg.MainButton.hide();
		} else {
			tg.MainButton.show();
		}
	}, [tg, state])

	const onChange = (e) => {
		const { name, value, selectedOptions } = e.target;
		if (selectedOptions) {
			// Если выбрано значение '', то не обновляем состояние
			if (value === '') {
				setState(prevState => ({ ...prevState, [name]: [] }));
			}
			else {
				setState(prevState => ({ ...prevState, [name]: Array.from(selectedOptions, option => option.value) }));
			}
		} else {
			// Иначе обрабатываем как обычное поле ввода
			setState(prevState => ({ ...prevState, [name]: value }));
		}
	};

	// Обработчик изменений input
	const onFilesChange = (event) => {
    const files = Array.from(event.target.files);
    const imageTypes = ['image/png', 'image/jpeg'];

    for (let i = 0; i < files.length; i++) {
        if (!imageTypes.includes(files[i].type)) {
            alert('Один из файлов не является изображением. Пожалуйста, загрузите только изображения формата .jpeg или .png.');
            return;
        }
    }

    // Если количество файлов вместе с уже выбранными не превышает 10
    if (files.length + selectedFiles.length <= 10) {
        // Создаем массив файлов из FileList
        const filesArray = files.map(file => ({
            file,
            id: Math.random().toString(36).substring(2, 9), // Генерируем уникальный ID
            previewUrl: URL.createObjectURL(file)
        }));

        // Обновляем состояние добавлением новых файлов
        setSelectedFiles(prevFiles => [...prevFiles, ...filesArray]);
    } else {
        alert('Вы можете загрузить не более 10 фотографий.');
    }
	};

	// Обработчик удаления файла и его превью из списка
	const removeFile = (id) => {
		setSelectedFiles(prevFiles => {
				const fileToRemove = prevFiles.find(fileObj => fileObj.id === id);
				URL.revokeObjectURL(fileToRemove.previewUrl);
				return prevFiles.filter(fileObj => fileObj.id !== id);
		});
	};

	const environmentObjects = [
		{ id: 0, name: 'Лес' },
		{ id: 1, name: 'Парк' },
		{ id: 2, name: 'Водоём' }
	];

	const infrastructureObjects = [
		{ id: 0, name: 'Дет. сад' },
		{ id: 1, name: 'Школа' },
		{ id: 2, name: 'Больница' },
		{ id: 3, name: 'Транспортная доступность' },
		{ id: 4, name: 'Торговые центры' }
	];

	const typeOfHouseObjects = [
		{ id: 0, name: 'Панельный' },
		{ id: 1, name: 'Кирпичный' },
		{ id: 2, name: 'Монолитный' }
	];

	const classOfHouseObjects = [
		{ id: 0, name: 'Эконом' },
		{ id: 1, name: 'Комфорт' },
		{ id: 2, name: 'Комфорт+' },
		{ id: 3, name: 'Бизнес' },
		{ id: 4, name: 'Элитное' }
	];

	const entranceConditionObjects = [
		{ id: 0, name: 'Удовл.' },
		{ id: 1, name: 'Среднее' },
		{ id: 2, name: 'Хорошее' },
	];

	const apartmentConditionObjects = [
		{ id: 0, name: 'Удовл.' },
		{ id: 1, name: 'Среднее' },
		{ id: 2, name: 'Хорошее' },
	];

	const repairObjects = [
		{ id: 0, name: 'Типовой' },
		{ id: 1, name: 'Евроремонт' },
		{ id: 3, name: 'Авторский проект' },
		{ id: 4, name: 'От застройщика' },
		{ id: 5, name: 'Требуется' },
	];

	const layoutObjects = [
		{ id: 0, name: 'Смежная' },
		{ id: 1, name: 'Раздельная' },
		{ id: 3, name: 'Распашонка' },
		{ id: 4, name: 'Студия' }
	];

	const bathroomObjects = [
		{ id: 0, name: 'Совместный' },
		{ id: 1, name: 'Раздельный' }
	];

	const kitchenObjects = [
		{ id: 0, name: 'Газовая колонка' },
		{ id: 1, name: 'Газовая плита' },
		{ id: 2, name: 'Электрическая плита' },
	];

	const hasBalconyObjects = [
		{ id: 0, name: 'Да' },
		{ id: 1, name: 'Нет' }
	];

	const glassPaneObjects = [
		{ id: 0, name: 'Пластик' },
		{ id: 1, name: 'Дерево' }
	];

	const furnitureObjects = [
		{ id: 0, name: 'Вся' },
		{ id: 1, name: 'Частично' },
		{ id: 2, name: 'Без мебели' }
	];

	const redevelopmentObjects = [
		{ id: 0, name: 'Не было' },
		{ id: 1, name: 'Незаконная' },
		{ id: 2, name: 'Узаконенная' }
	];

	const mortgageObjects = [
		{ id: 0, name: 'Да' },
		{ id: 1, name: 'Нет' }
	];

	const typeOfSaleObjects = [
		{ id: 0, name: 'Прямая' },
		{ id: 1, name: 'Альтернатива' }
	];

	return (
		<div className={"form"}>
			<h1><u>АНКЕТА КВАРТИРА</u></h1>
			<SelectOrInput
				parameterName="Адрес объекта:"
				name2="address" value2={state.address}
				onChangeFunc={onChange}
			/>
			<SelectOrInput
				parameterName="Цена от собственника:"
				name2="cost" value2={state.cost}
				onChangeFunc={onChange}
			/>
			<SelectOrInput
				parameterName="Условный (кадастровый) номер:"
				name2="cadastralNumber" value2={state.cadastralNumber}
				onChangeFunc={onChange}
			/>
			<h2><u>Характеристика района:</u></h2>
			<SelectOrInput
				parameterName="Окружение:"
				name1="environment" value1={state.environment} 
				name2="environmentText" value2={state.environmentText}
				valuesList={environmentObjects}
				onChangeFunc={onChange}
				multiple={true}
			/>
			<SelectOrInput
				parameterName="Инфраструктура:"
				name1="infrastructure" value1={state.infrastructure} 
				name2="infrastructureText" value2={state.infrastructureText}
				valuesList={infrastructureObjects}
				onChangeFunc={onChange}
				multiple={true}
			/>
			<h2><u>Характеристики объекта:</u></h2>
			<SelectOrInput
				parameterName="Тип дома:"
				name1="typeOfHouse" value1={state.typeOfHouse} 
				name2="typeOfHouseText" value2={state.typeOfHouseText}
				valuesList={typeOfHouseObjects}
				onChangeFunc={onChange}
				multiple={false}
			/>
			<SelectOrInput
				parameterName="Класс дома:"
				name1="classOfHouse" value1={state.classOfHouse} 
				name2="classOfHouseText" value2={state.classOfHouseText}
				valuesList={classOfHouseObjects}
				onChangeFunc={onChange}
				multiple={false}
			/>
			<SelectOrInput
				parameterName="Год постройки:"
				name2="yearBuilt" value2={state.yearBuilt}
				onChangeFunc={onChange}
				inputType="number"
				placeholderText="Введите число"
			/>
			<SelectOrInput
				parameterName="Состояние подъезда:"
				name1="entranceCondition" value1={state.entranceCondition} 
				name2="entranceConditionText" value2={state.entranceConditionText}
				valuesList={entranceConditionObjects}
				onChangeFunc={onChange}
				multiple={false}
			/>
			<SelectOrInput
				parameterName="Этажность дома:"
				name2="floorsCount" value2={state.floorsCount}
				onChangeFunc={onChange}
				inputType="number"
				placeholderText="Введите число"
			/>
			<SelectOrInput
				parameterName="Этаж:"
				name2="floorNumber" value2={state.floorNumber}
				onChangeFunc={onChange}
				inputType="number"
				placeholderText="Введите число"
			/>
			<SelectOrInput
				parameterName="Количество комнат:"
				name2="roomsCount" value2={state.roomsCount}
				onChangeFunc={onChange}
				inputType="number"
				placeholderText="Введите число"
			/>
			<SelectOrInput
				parameterName="Состояние квартиры:"
				name1="apartmentCondition" value1={state.apartmentCondition}
				valuesList={apartmentConditionObjects}
				onChangeFunc={onChange}
				multiple={false}
			/>
			<SelectOrInput
				parameterName="Ремонт:"
				name1="repair" value1={state.repair}
				name2="repairText" value2={state.repairText}
				valuesList={repairObjects}
				onChangeFunc={onChange}
				multiple={false}
			/>
			<div className="container">
				<div className="parameter_name"><b><i>Площадь квартиры (кв.м):</i></b></div>
				<div className="squares">
					<div className="squares__item">
						<div>общая:</div>
						<input name="squareTotal" type="number" value={state.squareTotal} onChange={onChange} placeholder='Введите число'/>
					</div>
					<div className="squares__item">
						<div>жилая:</div>
						<input name="squareLiving" type="number" value={state.squareLiving} onChange={onChange} placeholder='Введите число'/>
					</div>
					<div className="squares__item">
						<div>кухня:</div>
						<input name="squareKitchen" type="number" value={state.squareKitchen} onChange={onChange} placeholder='Введите число'/>
					</div>
				</div>
			</div>
			<SelectOrInput
				parameterName="Планировка:"
				name1="layout" value1={state.layout}
				name2="layoutText" value2={state.layoutText}
				valuesList={layoutObjects}
				onChangeFunc={onChange}
				multiple={false}
			/>
			<SelectOrInput
				parameterName="Санузел:"
				name1="bathroom" value1={state.bathroom}
				valuesList={bathroomObjects}
				onChangeFunc={onChange}
				multiple={false}
			/>
			<SelectOrInput
				parameterName="Количество санузлов:"
				name2="bathroomСount" value2={state.bathroomСount}
				onChangeFunc={onChange}
				inputType="number"
				placeholderText="Введите число"
			/>
			<SelectOrInput
				parameterName="На кухне:"
				name1="kitchen" value1={state.kitchen}
				name2="kitchenText" value2={state.kitchenText}
				valuesList={kitchenObjects}
				onChangeFunc={onChange}
				multiple={false}
			/>
			<SelectOrInput
				parameterName="Наличие балкона/лоджии:"
				name1="hasBalcony" value1={state.hasBalcony}
				valuesList={hasBalconyObjects}
				onChangeFunc={onChange}
				multiple={false}
			/>
			<SelectOrInput
				parameterName="Стеклопакеты:"
				name1="glassPane" value1={state.glassPane}
				name2="glassPaneText" value2={state.glassPaneText}
				valuesList={glassPaneObjects}
				onChangeFunc={onChange}
				multiple={false}
			/>
			<SelectOrInput
				parameterName="Мебель, которая останется при продаже:"
				name1="furniture" value1={state.furniture}
				name2="furnitureText" value2={state.furnitureText}
				valuesList={furnitureObjects}
				onChangeFunc={onChange}
				multiple={false}
			/>
			<SelectOrInput
				parameterName="Перепланировка:"
				name1="redevelopment" value1={state.redevelopment}
				name2="redevelopmentText" value2={state.redevelopmentText}
				valuesList={redevelopmentObjects}
				onChangeFunc={onChange}
				multiple={false}
			/>
			<SelectOrInput
				parameterName="Нюансы и обременения:"
				name2="nuances" value2={state.nuances}
				onChangeFunc={onChange}
			/>
			<SelectOrInput
				parameterName="Возможность покупки в ипотеку:"
				name1="mortgage" value1={state.mortgage}
				valuesList={mortgageObjects}
				onChangeFunc={onChange}
				multiple={false}
			/>
			<SelectOrInput
				parameterName="Продажа:"
				name1="typeOfSale" value1={state.typeOfSale}
				valuesList={typeOfSaleObjects}
				onChangeFunc={onChange}
				multiple={false}
			/>
			<SelectOrInput
				parameterName="Примечания:"
				name2="notes" value2={state.notes}
				onChangeFunc={onChange}
			/>
			<h2><u>Изображения:</u></h2>
			<div className="images_container">
					<input type="file" multiple onChange={onFilesChange} />
					{selectedFiles.map((fileObj) => (
						<div className="image-block" key={fileObj.id}>
								<span>{fileObj.file.name}</span>
								<img src={fileObj.previewUrl} alt="Preview" />
								<button type="button" onClick={() => removeFile(fileObj.id)}>Удалить</button>
						</div>
					))}
			</div>
		</div>
	);
};

export default ApartmentForm;