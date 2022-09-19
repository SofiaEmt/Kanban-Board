import kanbanAPI from "../api/kanbanAPI.js";
import DropZone from "./dropzone.js";
import Item from "./item.js";

export default class Column {
    constructor(id, title){

        const topDropZone = DropZone.createDropZone();

        this.elements = {};
        this.elements.root = Column.createRoot();
        this.elements.title = this.elements.root.querySelector(".kanban_column-title");
        this.elements.items = this.elements.root.querySelector(".kanban_column-items");
        this.elements.addItem = this.elements.root.querySelector(".kanban_add-item");

/*         if (this.elements.title.textContent == "Completed") {
            this.elements.root.querySelector(".kanban_add-item");
        }
     */
        this.elements.root.dataset.id = id;
        this.elements.title.textContent = title;
        this.elements.items.appendChild(topDropZone);
    
        this.elements.addItem.addEventListener("click", () => {
            const newItem = kanbanAPI.insertItem(id, []);

            this.renderItem(newItem);
        });

        //Call the API
        kanbanAPI.getItems(id).forEach(item => {
            this.renderItem(item);
        })
    }



    // Return HTML element as an object containing the basic structure
    // for a particular column: 
    static createRoot() {
        const range = document.createRange();

        range.selectNode(document.body);

        return range.createContextualFragment(`
        <div class="kanban_column">
            <div class="kanban_column-title"></div>
            <div class="kanban_column-items" draggable="true"></div>
            <button class="kanban_add-item" type="button">+ add</button>
        </div>
        `).children[0];
    }


    
    renderItem(data) {
        const item = new Item(data.id, data.content);

        this.elements.items.appendChild(item.elements.root);
    }
}

