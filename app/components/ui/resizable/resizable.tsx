import { GripVertical } from "lucide-react";
import { Group, Panel, Separator } from "react-resizable-panels";
import classNames from "classnames";
import styles from "./resizable.module.css";

const ResizablePanelGroup = ({ className, ...props }: React.ComponentProps<typeof Group>) => (
  <Group className={classNames(styles.group, className)} {...props} />
);

const ResizablePanel = Panel;

const ResizableHandle = ({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof Separator> & {
  withHandle?: boolean;
}) => (
  <Separator className={classNames(styles.handle, className)} {...props}>
    {withHandle && (
      <div className={styles.gripWrapper}>
        <GripVertical className={styles.gripIcon} />
      </div>
    )}
  </Separator>
);

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
