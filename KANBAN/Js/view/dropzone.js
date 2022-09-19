import kanbanAPI from "../api/kanbanAPI.js";

export default class DropZone {
    static createDropZone() {
        const range = document.createRange();

        range.selectNode(document.body);

        const dropZone =  range.createContextualFragment(`
            <div class="kanban_dropzone"></div>
        `).children[0];

        dropZone.addEventListener("dragover", e => {
            e.preventDefault();
            dropZone.classList.add("kanban_dropzone--active");
        });

        dropZone.addEventListener("dragleave", () => {
            dropZone.classList.remove("kanban_dropzone--active");
        });

        dropZone.addEventListener("drop", e => {
            e.preventDefault();
            dropZone.classList.remove("kanban_dropzone--active");

            const columnElement = dropZone.closest(".kanban_column");
            const columnId = Number(columnElement.dataset.id);
            const dropZonesInColumn = Array.from(columnElement.querySelectorAll(".kanban_dropzone"));
            const droppedIndex = dropZonesInColumn.indexOf(dropZone);
            const itemId = Number(e.dataTransfer.getData("text/plain"));
            const droppedItemElement = document.querySelector(`[data-id="${itemId}"]`)
            const insertAfter = dropZone.parentElement.classList.contains("kanban_item") ? dropZone.parentElement : dropZone;

            if (droppedItemElement.contains(dropZone)) {
                return;
            }

            insertAfter.after(droppedItemElement);
            kanbanAPI.updateItem(itemId, {
                columnId,
                position: droppedIndex
            });
        });



        return dropZone;
    }
}