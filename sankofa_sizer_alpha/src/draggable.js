import interact from "interactjs";

export function draggable(node) {
  interact(node)
    .draggable({
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: "parent",
        }),
      ],
      listeners: {
        move: (event) => {
          const { dx, dy } = event;
          const target = event.target;

          const x = (parseFloat(target.getAttribute("data-x")) || 0) + dx;
          const y = (parseFloat(target.getAttribute("data-y")) || 0) + dy;

          target.style.transform = `translate(${x}px, ${y}px)`;

          target.setAttribute("data-x", x);
          target.setAttribute("data-y", y);

					/*
          // Apply the transformations to all direct child elements
          for (const child of target.children) {
            child.style.transform = `translate(${x}px, ${y}px)`;
          }
					*/
        },
      },
    })
    .resizable({
      edges: { left: true, right: true, bottom: true, top: true },
      modifiers: [
        interact.modifiers.restrictSize({
          min: { width: 50, height: 50 },
        }),
      ],
      listeners: {
        move: (event) => {
          const { width, height } = event.rect;
          const { left, top } = event.deltaRect;
          const target = event.target;

          target.style.width = `${width}px`;
          target.style.height = `${height}px`;

          target.style.transform += `translate(${left}px, ${top}px)`;
        },
        end: (event) => {
          const target = event.target;

          const x = (parseFloat(target.getAttribute("data-x")) || 0);
          const y = (parseFloat(target.getAttribute("data-y")) || 0);

          target.setAttribute("data-x", x);
          target.setAttribute("data-y", y);
        },
      },
    });
}