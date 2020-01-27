import React from 'react';
import { Component } from 'react';
import { Dropdown, Container, Header, List  } from 'semantic-ui-react'

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
                    if (!(category_val in category_labels[categories[j].category_name]["values"])) {
                        category_labels[categories[j].category_name]["values"].push(category_val);
                    }
                }
            }

            this.setState({ categories: category_labels });
            this.setState({ category_visibility: category_visibility });

        }
    }


    handleChange(category) {

        var category_visible = this.state.category_visibility[category];
        var all_category_visibilities = this.state.category_visibility;
        all_category_visibilities[category] = !category_visible;
        this.setState({ category_visibility: all_category_visibilities });

        // console.log(this.state.category_visibility[category]);
        // console.log(this.state.category_visibility);
    }

    createDropdownSelection(options) {
        var dropdown_selection = [];
        for (var i = 0; i < options.length; ++i) {
            // dropdown_selection.push(
            //     <a class="dropdown-item" href="#">{options[i]}</a>
            // );
            dropdown_selection.push(
                {
                    key : options[i],
                    text : options[i],
                    value : options[i]
                }
            );
        }
        return dropdown_selection;
    }


    createCategoryCheckboxes() {
        console.log("Create checkboxes");
        console.log(this.state.categories);
        var category_checkboxes = [];
        for (const category_name in this.state.categories) {
            console.log("Category name: " + category_name);
            var type = this.state.categories[category_name]["type"];
            var values = this.state.categories[category_name]["values"];
            var id = this.state.categories[category_name]["id"];

            if (type == "string") {
                // const dropdown_content = this.state.category_visibility[category_name]
                //     ? <div>
                //         <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" />
                //         <div class="dropdown-menu" id={category_name + "_selection"} aria-labelledby="dropdownMenuButton" >
                //             {this.createDropdownSelection(values)}
                //         </div>
                //     </div>
                //     : null;
            
                const dropdown_content = this.state.category_visibility[category_name]
                    ? <Dropdown
                        placeholder='Select'
                        fluid
                        search
                        selection
                        options={this.createDropdownSelection(values)}
                    />
                    : null;

                // For strings, each checkbox has a dropdown menu
                category_checkboxes.push(
                    <div className="row">
                        <input type="checkbox" id={category_name} onChange={() => this.handleChange(category_name)} />
                        {category_name}
                        {dropdown_content}
                    </div>
                )

            }
            else {
                const textbox_content = this.state.category_visibility[category_name]
                    ? <div>
                        <div className="row">
                            Min: <input type="Text" id={category_name + "_min"} />
                        </div>
                        <div className="row">
                            Max: <input type="Text" id={category_name + "_max"} />
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