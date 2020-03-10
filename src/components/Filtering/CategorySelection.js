import React from 'react';
import { Component } from 'react';
import "../../css/CategorySelection.css";
import InfoButton from "../Info/InfoButton";
import ReactModal from 'react-modal';

class CategorySelection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: {},
            category_visibility: {},
            checkboxes: null,
            showModal: false,
            default_categories : props.defaultCategories,
        };
        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
        this.loadPreviousSelection = false;
    }
    componentDidMount() {
        this.getAllCategories();
    }

    componentDidUpdate(prevProps) {

        if (this.state.default_categories !== this.props.defaultCategories) {

            var category_visibility = {}
            for (const category_name in this.state.categories) {
                category_visibility[category_name] = (category_name in this.props.defaultCategories);
            }

            this.setState({ category_visibility : category_visibility, default_categories : this.props.defaultCategories });
        }
        // Reset the value that is currently stored in the min/max boxes
        if (document.getElementById("Acreage_min") !== null && document.getElementById("Acreage_min").value !== document.getElementById("Acreage_min").defaultValue) {
            document.getElementById("Acreage_min").value = document.getElementById("Acreage_min").defaultValue;
        }
        if (document.getElementById("Acreage_max") !== null && document.getElementById("Acreage_max").value !== document.getElementById("Acreage_max").defaultValue) {
            document.getElementById("Acreage_max").value = document.getElementById("Acreage_max").defaultValue;
            
        }
    }

    getAllCategories() {

        if (this.props.data.length > 0) {
            var category_labels = {}
            var category_visibility = {}
            var category_id = 1;
            for (var i = 0; i < this.props.data.length; ++i) {

                var categories = this.props.data[i].categories;
                if (categories != null)
                {

                    for (var j = 0; j < categories.length; ++j) {
                        if (!(categories[j].category_name in category_labels)) {
                            category_labels[categories[j].category_name] = {};
                            category_labels[categories[j].category_name]["type"] = categories[j].type;
                            category_labels[categories[j].category_name]["values"] = [];
                            category_labels[categories[j].category_name]["id"] = category_id;
                            category_visibility[categories[j].category_name] = (categories[j].category_name in this.state.default_categories);
                            category_id = category_id + 1;
                        }
                        var category_val = categories[j].value;
                        category_labels[categories[j].category_name]["values"].push(category_val);
                    }
                }
            }

            for (var key in category_labels)
            {
                category_labels[key]["values"] = [...new Set(category_labels[key]["values"])];
            }
            this.setState({ categories: category_labels, category_visibility: category_visibility });

        }
    }


    handleChange(category, e) {

        const category_visible = this.state.category_visibility[category];
        var all_category_visibilities = JSON.parse(JSON.stringify(this.state.category_visibility));
        all_category_visibilities[category] = !category_visible;

        if (! (document.getElementById(category).checked) )
        {
            this.props.handleDeselect(category);
        }

        this.setState({ category_visibility: all_category_visibilities });

    }

    handleSelection(category, event) {
        const text = event.target.value;
        this.props.handleSelection(category, text);
    }

    handleMinMaxInput(category, min_max, event) {
        // min_max will equal either "MIN" or "MAX"
        const text = event.target.value;
        // This is my hacky way of making sure that the inputted acreage does not reset if the user selects a crop type
        document.getElementById("Acreage_min").defaultValue = document.getElementById("Acreage_min").value;
        document.getElementById("Acreage_max").defaultValue = document.getElementById("Acreage_max").value;
        
        this.props.handleInput(category, min_max, text);
    }

    handleDeselect(category) {
        this.props.handleDeselect(category);
    }

    createDropdownSelection(options, default_selection) {
        var dropdown_selection = [];
        dropdown_selection.push(
            <option value="NULL" selected >Select</option>
        );

        for (var i = 0; i < options.length; ++i) {

            if (default_selection === options[i]) {
                dropdown_selection.push(
                    <option value={options[i]} selected>{options[i]}</option>
                );
            }
            else {
                dropdown_selection.push(
                    <option value={options[i]} >{options[i]}</option>
                );
            }
        }
        return dropdown_selection;
    }
    inputValidate(e) {
        var key = e.keyCode || e.which;
        // Disable all non digits except for backspace, delete, left arrow, and right arrow
        if (((key < 48) || (key > 57)) && (key != 8) && (key != 46) && (key != 37) && (key != 39) && (e.keyCode < 96 || e.keyCode > 105)) { 
            if (e.preventDefault) e.preventDefault();
            e.returnValue = false;
        }
    }

    createMinInputBox(category_name, default_val) {
        if (default_val === null) {
            return (<div>
                        Min: <input type="Number" min="0" onKeyDown={(e) => this.inputValidate(e)} className="input-box" onChange={(e) => this.handleMinMaxInput(category_name, "MIN", e)} id={category_name + "_min"} />
                    </div>) 
        }
        else {
            return (<div>
                        Min: <input type="Number" min="0" onKeyDown={(e) => this.inputValidate(e)} defaultValue={default_val} className="input-box" onChange={(e) => this.handleMinMaxInput(category_name, "MIN", e)} id={category_name + "_min"} />
                    </div>);
        }
    }

    createMaxInputBox(category_name, default_val) {
        if (default_val === null) {
            return (<div>
                        Max: <input type="Number" min="0" onKeyDown={(e) => this.inputValidate(e)} className="input-box" onChange={(e) => this.handleMinMaxInput(category_name, "MAX", e)} id={category_name + "_max"} />
                    </div>)
        }
        else {

            return (<div>
                        Max: <input type="Number" min="0" onKeyDown={(e) => this.inputValidate(e)} defaultValue={default_val} className="input-box" onChange={(e) => this.handleMinMaxInput(category_name, "MAX", e)} id={category_name + "_max"} />
                    </div>)
        }
    }

    createCategoryCheckboxes() {
        var category_checkboxes = [];
        for (const category_name in this.state.categories) {
            const type = this.state.categories[category_name]["type"];
            const values = this.state.categories[category_name]["values"];
            
            if (type === "string") {
                var default_selection = null
                if (category_name in this.state.default_categories) {
                    default_selection = this.state.default_categories[category_name];
                }
                const dropdown_content = this.state.category_visibility[category_name]
                    ? <div className="input-box">
                        <select className="input-box" id={category_name + "_selection"} data-live-search="true" onChange={(e) => this.handleSelection(category_name, e)} >
                            {this.createDropdownSelection(values, default_selection)}
                        </select>
                    </div>
                    : null;

                const checked = (dropdown_content !== null);
                // For strings, each checkbox has a dropdown menu
                category_checkboxes.push(
                    <div>
                        <input type="checkbox" className="m-1" id={category_name} checked={checked} onChange={(e) => this.handleChange(category_name, e)} />
                        {category_name}
                        {dropdown_content}
                    </div>
                )

            }
            else {
                var default_min = null;
                var default_max = null;
                if (category_name in this.state.default_categories) {
                    if (typeof this.state.default_categories[category_name]["MIN"] !== 'undefined') {
                        default_min = this.state.default_categories[category_name]["MIN"];
                    }
                    if (typeof this.state.default_categories[category_name]["MAX"] !== 'undefined') {
                        default_max = this.state.default_categories[category_name]["MAX"];
                    }
                }
                const textbox_content = this.state.category_visibility[category_name]
                    ? <div>
                        {this.createMinInputBox(category_name, default_min)}
                        {this.createMaxInputBox(category_name, default_max)}
                    </div>
                    : null;

                const checked = (textbox_content !== null);

                // For ints, the user inputs a min and a max
                category_checkboxes.push(
                    <div>
                        <input type="checkbox" className="m-1" id={category_name} checked={checked} onChange={() => this.handleChange(category_name)} /> 
                        {category_name}
                        {textbox_content}
                    </div>
                );

            }
            
        }
        this.loadPreviousSelection = false;

        return category_checkboxes;

    }

    handleOpenModal () {
        this.setState({ showModal: true });
    }

    handleCloseModal () {
        this.setState({ showModal: false });
    }

    render() {
        return (
            <div className="col-12">
                <div className="card">
                    <div className="card-header">
                        <h5 className="d-inline-block">Categories</h5>
                        <InfoButton handleOpenModal={this.handleOpenModal}/>
                    </div>
                    <ReactModal className="modal-side-categories" isOpen={this.state.showModal}  contentLabel="Minimal Modal Example" style={{ overlay: { backgroundColor: 'transparent' }}}>  
                        <div class="modal-header">
                            <h5 class="modal-title">Categories</h5>
                            <button type="button" className="close" aria-label="Close" onClick={this.handleCloseModal}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <p>Filter out which fields to see. 
                                View fields only between certain acreages or only view fields of a specific crop.
                            </p>
                        </div>
                    </ReactModal>
                    <div className="card-body display-text">
                           
                        {this.createCategoryCheckboxes()}

                    </div>
                </div>
            </div>

        );
    }

}

export default CategorySelection;