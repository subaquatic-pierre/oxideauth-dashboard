import { ColumnDef } from '@tanstack/react-table';

import { PermsTableRow } from '@/components/dashboard/permissions/PermissionsView';
import { IndeterminateCheckbox } from '@/components/third-party/react-table';

export const buildPermissionTableColumns = (): ColumnDef<PermsTableRow>[] => [
  {
    id: 'id',
    header: ({ table }) => (
      <IndeterminateCheckbox
        {...{
          checked: table.getIsAllRowsSelected(),
          indeterminate: table.getIsSomeRowsSelected(),
          onChange: table.getToggleAllRowsSelectedHandler(),
        }}
      />
    ),
    cell: ({ row }) => (
      <IndeterminateCheckbox
        {...{
          checked: row.getIsSelected(),
          disabled: !row.getCanSelect(),
          indeterminate: row.getIsSomeSelected(),
          onChange: row.getToggleSelectedHandler(),
        }}
      />
    ),
  },
  {
    id: 'name',
    header: 'Name',
    accessorKey: 'name',
  },
];
