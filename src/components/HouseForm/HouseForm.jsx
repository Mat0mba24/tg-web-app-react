import { useState, useEffect, useCallback } from 'react';
import './HouseForm.css';
import { useTelegram } from '../../hooks/useTelegram';
import SelectOrInput from '../SelectOrInput/SelectOrInput';

const HouseForm = () => {
	const initialState = {
		// общее
		address: '',
		cost: '',
		cadastralNumber: '',
		// район
		environment: [],
		environmentText: '',
		infrastructure: [],
		infrastructureText: '',
		// объект
		typeOfHouse: [],
		wallMaterial: [],
		classOfHouse: [],
		classOfHouseText: '',
		yearBuilt: '',
		floorsCount: '',
		houseCondition: [],
		repair: [],
		squareHouse: '',
		squareArea: '',
		landCategory: [],
		roomsCount: '',
		bathroomСount: '',
		communications: [],
		furniture: [],
		furnitureText: '',
		mkadDistance: '',
		nuances: '',
		mortgage: [],
		typeOfSale: [],
		notes: ''
	};
	
	const [state, setState] = useState(initialState);
	const [selectedFiles, setSelectedFiles] = useState([]);
	const { tg, user, queryId } = useTelegram();

	console.log(state);

	const onSendData = useCallback(() => {
    // Создаем новый объект FormData
    const formData = new FormData();

    // Добавляем данные формы
    Object.entries(state).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
        } else {
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
    fetch('https://mat0m6a.ru/house_form_data', {
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
		const areAllFieldsFilled = () => {
			return Object.values(state).every(value => {
				if (Array.isArray(value)) {
					// Если значение является массивом, проверяем, что он не пуст
					return value.length > 0;
				} else {
					// Иначе проверяем, что значение не пустое
					return value !== '' && value !== 0;
				}
			});
		};
		if (!areAllFieldsFilled()) {
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
		{ id: 0, name: 'Дом' },
		{ id: 1, name: 'Дача' },
		{ id: 2, name: 'Коттедж' },
		{ id: 3, name: 'Таунхаус' }
	];

	const wallMaterialObjects = [
		{ id: 0, name: 'Кирпич' },
		{ id: 1, name: 'Брус' },
		{ id: 2, name: 'Бревно' },
		{ id: 3, name: 'Газоблоки' },
		{ id: 4, name: 'Металл' },
		{ id: 5, name: 'Пеноблоки' },
		{ id: 6, name: 'Сэндвич-панели' },
		{ id: 7, name: 'Другое' }
	];

	const classOfHouseObjects = [
		{ id: 0, name: 'Эконом' },
		{ id: 1, name: 'Комфорт' },
		{ id: 2, name: 'Комфорт+' },
		{ id: 3, name: 'Бизнес' },
		{ id: 4, name: 'Элитное' }
	];

	const houseConditionObjects = [
		{ id: 0, name: 'Удовл.' },
		{ id: 1, name: 'Среднее' },
		{ id: 2, name: 'Хорошее' },
	];

	const repairObjects = [
		{ id: 0, name: 'Типовой' },
		{ id: 1, name: 'Евроремонт' },
		{ id: 3, name: 'Авторский проект' },
		{ id: 4, name: 'От застройщика' },
		{ id: 5, name: 'Черновая' },
		{ id: 6, name: 'Чистовая' }
	];

	const landCategoryObjects = [
		{ id: 0, name: 'ИЖС' },
		{ id: 1, name: 'СНТ' },
		{ id: 3, name: 'ДНТ' },
		{ id: 4, name: 'ЛПХ' },
		{ id: 5, name: 'Фермерское хозяйство' }
	];

	const communicationsObjects = [
		{ id: 0, name: 'Электричество' },
		{ id: 1, name: 'Газ' },
		{ id: 3, name: 'Отопление' },
		{ id: 4, name: 'Канализация' }
	];

	const furnitureObjects = [
		{ id: 0, name: 'Вся' },
		{ id: 1, name: 'Частично' },
		{ id: 2, name: 'Без мебели' }
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
			<h1><u>АНКЕТА ДОМ</u></h1>
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
				parameterName="Вид объекта:"
				name1="typeOfHouse" value1={state.typeOfHouse} 
				valuesList={typeOfHouseObjects}
				onChangeFunc={onChange}
				multiple={false}
			/>
			<SelectOrInput
				parameterName="Материал стен:"
				name1="wallMaterial" value1={state.wallMaterial} 
				valuesList={wallMaterialObjects}
				onChangeFunc={onChange}
				multiple={true}
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
				parameterName="Этажность дома:"
				name2="floorsCount" value2={state.floorsCount}
				onChangeFunc={onChange}
				inputType="number"
				placeholderText="Введите число"
			/>
			<SelectOrInput
				parameterName="Состояние дома:"
				name1="houseCondition" value1={state.houseCondition}
				valuesList={houseConditionObjects}
				onChangeFunc={onChange}
				multiple={false}
			/>
			<SelectOrInput
				parameterName="Ремонт:"
				name1="repair" value1={state.repair}
				valuesList={repairObjects}
				onChangeFunc={onChange}
				multiple={false}
			/>
			<SelectOrInput
				parameterName="Площадь дома (кв. м.):"
				name2="squareHouse" value2={state.squareHouse}
				onChangeFunc={onChange}
				inputType="number"
				placeholderText="Введите число"
			/>
			<SelectOrInput
				parameterName="Площадь участка (кв. м.):"
				name2="squareArea" value2={state.squareArea}
				onChangeFunc={onChange}
				inputType="number"
				placeholderText="Введите число"
			/>
			<SelectOrInput
				parameterName="Категория замель:"
				name1="landCategory" value1={state.landCategory}
				valuesList={landCategoryObjects}
				onChangeFunc={onChange}
				multiple={false}
			/>
			<SelectOrInput
				parameterName="Количество спален:"
				name2="roomsCount" value2={state.roomsCount}
				onChangeFunc={onChange}
				inputType="number"
				placeholderText="Введите число"
			/>
			<SelectOrInput
				parameterName="Санузел (кол-во):"
				name2="bathroomСount" value2={state.bathroomСount}
				onChangeFunc={onChange}
				inputType="number"
				placeholderText="Введите число"
			/>
			<SelectOrInput
				parameterName="Коммуникации:"
				name1="communications" value1={state.communications}
				valuesList={communicationsObjects}
				onChangeFunc={onChange}
				multiple={true}
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
				parameterName="Расстояние до МКАД (для Москвы):"
				name2="mkadDistance" value2={state.mkadDistance}
				onChangeFunc={onChange}
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

export default HouseForm;