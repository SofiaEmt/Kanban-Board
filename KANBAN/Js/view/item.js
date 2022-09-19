import kanbanAPI from "../api/kanbanAPI.js";
import DropZone from "./dropzone.js";

export default class Item {
    constructor(id, content) {
        const bottomDropZone = DropZone.createDropZone();

        this.elements = {};
        this.elements.root = Item.createRoot();
        this.elements.input = this.elements.root.querySelector(".items_item-input");

        this.elements.root.dataset.id = id;
        this.elements.input.textContent = content;
        this.content = content;
        this.elements.root.appendChild(bottomDropZone);

        //give user ability to update the content of a single item
        const onBlur = () => {
            const newContent = this.elements.input.textContent.trim();

            if (newContent == this.content) {
                return;
            }

            //save the new content on reload:
            this.content = newContent;
            kanbanAPI.updateItem(id, {
                content: this.content
            });
        };

        this.elements.input.addEventListener("blur", onBlur)

        //delete an item:
        this.elements.root.addEventListener("dblclick", () => {
            const check = confirm("Are you sure you want to delete the task?");

            if(check) {
                kanbanAPI.deleteItem(id);
                // + remove the item from the localstorage
                this.elements.input.removeEventListener("blur", onBlur);
                // + remove the item from the html (visualy)
                this.elements.root.parentElement.removeChild(this.elements.root);
            }
        });

        //alow the item to be dragged by the user 
        this.elements.root.addEventListener("dragstart", e => {
            e.dataTransfer.setData("text/plain", id);
        });

        this.elements.input.addEventListener("drop", e => {
            e.preventDefault();
        });
    }

    static createRoot() {
        const range = document.createRange();

        range.selectNode(document.body);

        return range.createContextualFragment(`
            <div class="kanban_item" draggable="true">
                <div class="items_item-input" contenteditable></div>
            </div>
        `).children[0];
    }
}