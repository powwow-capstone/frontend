import React from 'react';
import { Component } from 'react';

class CategoryFiltering extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data,          
            categories: {},
            category_visibility: {}
        };
    }
    componentDidMount() {
        this.getAllCategories();
    }

    getAllCategories() {

        if (this.state.data.length > 0) {
            
            var category_labels = {}
            var category_visibility = {}
            var category_id = 1;
            console.log("Adding to category labels");
            for (var i = 0; i < this.state.data.length; ++i) {

                var categories = this.state.data[i].categories;

                for (var j = 0; j < categories.length; ++j) {
                    if (!(categories[j].category_name in category_labels)) {
                        category_labels[categories[j].category_name] = {};
                        category_labels[categories[j].category_name]["type"] = categories[j].type;
                        category_labels[categories[j].category_name]["values"] = [];
                        category_labels[categories[j].category_name]["id"] = category_id;
                        category_visibility[categories[j].category_name] = false;
                        category_id = category_id + 1;
                    }
                    var category_val = categories[j].value;
                    category_labels[categories[j].category_name]["values"].push(category_val);
                }
            }

            for (var key in category_labels)
            {
                category_labels[key]["values"] = [...new Set(category_labels[key]["values"])];
            }

            this.setState({ categories: category_labels });
            this.setState({ category_visibility: category_visibility });

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
        // console.log(this.state.category_visibility[category]);
        // console.log(this.state.category_visibility);
    }

    handleSelection(category, event) {
        const text = event.target.value;
        this.props.handleSelection(category, text);
    }

    handleMinMaxInput(category, min_max, event) {
        // min_max will equal either "MIN" or "MAX"

        const text = event.target.value;
        this.props.handleInput(category, min_max, text);
    }

    handleDeselect(category) {
        this.props.handleDeselect(category);
    }

    createDropdownSelection(options) {
        var dropdown_selection = [];
        dropdown_selection.push(
            <option value="NULL" selected >Select</option>
        );
        for (var i = 0; i < options.length; ++i) {
            // dropdown_selection.push(
            //     <a class="dropdown-item" href="#">{options[i]}</a>
            // );
            dropdown_selection.push(
            <option value={options[i]} >{options[i]}</option>
            );
        }
        return dropdown_selection;
    }


    createCategoryCheckboxes() {
        // console.log("Create checkboxes");
        // console.log(this.state.categories);
        var category_checkboxes = [];
        for (const category_name in this.state.categories) {
            // console.log("Category name: " + category_name);
            const type = this.state.categories[category_name]["type"];
            const values = this.state.categories[category_name]["values"];
            const id = this.state.categories[category_name]["id"];

            if (type == "string") {
                const dropdown_content = this.state.category_visibility[category_name]
                    ? <div>
                        <select class="selectpicker" id={category_name + "_selection"} data-live-search="true" onChange={(e) => this.handleSelection(category_name, e)} >
                            {this.createDropdownSelection(values)}
                        </select>
                    </div>
                    : null;
            

                // For strings, each checkbox has a dropdown menu
                category_checkboxes.push(
                    <div className="row">
                        <input type="checkbox" id={category_name} onChange={(e) => this.handleChange(category_name, e)} />
                        {category_name}
                        {dropdown_content}
                    </div>
                )

            }
            else {
                const textbox_content = this.state.category_visibility[category_name]
                    ? <div>
                        <div className="row">
                            Min: <input type="Text" onChange={(e) => this.handleMinMaxInput(category_name,"MIN", e)} id={category_name + "_min"} />
                        </div>
                        <div className="row">
                            Max: <input type="Text" onChange={(e) => this.handleMinMaxInput(category_name, "MIN", e)} id={category_name + "_max"} />
                        </div>
                    </div>
                    : null;

                // For ints, the user inputs a min and a max
                category_checkboxes.push(
                    <div>
                        <div className="row">
                            <input type="checkbox" id={category_name} onChange={() => this.handleChange(category_name)} /> {category_name}
                        </div>
                        {textbox_content}
                    </div>
                );

            }

        }

        return category_checkboxes;

    }

    render() {
        return (
            <div className="col-12">
                <div className="card">
                    <h5 className="card-header">Categories</h5>
                    <div className="card-body">
                        <div className="card-text">
                           
                            {this.createCategoryCheckboxes()}
                           
                        </div>

                    </div>
                </div>
            </div>

        );
    }

}

export default CategoryFiltering;