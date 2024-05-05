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
					{
						props.name2 && (
							<input name={props.name2} value={props.value2} onChange={props.onChangeFunc} type="text" placeholder="Введите текст"/>
						)
					}
				</div>
			</div>
	);
}

export default SelectOrInput;