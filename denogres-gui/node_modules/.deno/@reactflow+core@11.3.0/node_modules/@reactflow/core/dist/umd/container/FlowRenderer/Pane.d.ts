import type { MouseEvent } from 'react';
import type { FlowRendererProps } from '.';
declare type PaneProps = Pick<FlowRendererProps, 'onClick' | 'onContextMenu' | 'onWheel'> & {
    onMouseEnter?: (event: MouseEvent) => void;
    onMouseMove?: (event: MouseEvent) => void;
    onMouseLeave?: (event: MouseEvent) => void;
};
declare function Pane({ onClick, onMouseEnter, onMouseMove, onMouseLeave, onContextMenu, onWheel }: PaneProps): JSX.Element;
export default Pane;
//# sourceMappingURL=Pane.d.ts.map