import React from 'react';
import './SelectOrInput.css';

const SelectOrInput = (props) => {
	return (
			<div class="container">
				<div class="parameter_name"><b><i>{props.parameterName}</i></b></div>
				<div class="select_or_input">
					{
						props.name1 && (
							<select name={props.name1} value={props.value1} onChange={props.onChangeFunc} multiple={props.multiple}>
								{!props.multiple && (<option value="">Выберите</option>)}
								{props.valuesList.map((i) => (
									<option value={i.id}>{i.name}</option>
								))}
							</select>
						)
					}
					{ // если указан тип, то он числовой
						props.name2 && props.inputType && (
							props.inputType && (
								<input 
								name={props.name2} 
								value={props.value2} 
								onChange={props.onChangeFunc} 
								type={props.inputType}
								placeholder={props.placeholderText}
							/>
							)
						)
					}
					{ // если не указан тип, то он текстовый, поэтому создаем textarea
						props.name2 && !props.inputType && (
							<textarea 
								name={props.name2} 
								onChange={props.onChangeFunc} 
								placeholder="Введите текст"
							>
								{props.value2}
							</textarea>
						)
					}
				</div>
			</div>
	);
}

export default SelectOrInput;