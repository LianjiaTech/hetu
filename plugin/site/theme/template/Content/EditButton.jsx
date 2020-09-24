import { Icon, Tooltip } from 'antd';
import React from 'react';

const branchUrl = 'http://github.com/LianjiaTech/hetu/tree/master';

export default function EditButton({ title, filename }) {
  let href = `${branchUrl}/site/${filename}`
  if (/^components\//.test(filename)) {
    href = `${branchUrl}/src/${filename}`
  }
  return (
    <Tooltip title={title}>
      <a
        className="edit-button"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Icon type="edit" />
      </a>
    </Tooltip>
  );
}
