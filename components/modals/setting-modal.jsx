'use client'

import { useSetting } from '@/hooks/use-setting'
import { ModeToggle } from '../mode-toggle'
import { Dialog, DialogContent, DialogHeader } from '../ui/dialog'
import { Label } from '../ui/label'

export default function SettingModal() {
  const setting = useSetting()

  const handleOnClose = () => setting.onClose()

  return (
    <Dialog open={setting.isOpen} onOpenChange={handleOnClose}>
      <DialogContent>
        <DialogHeader className='pb-3 border-b'>
          <h2 className='text-lg font-medium'>My settings</h2>
        </DialogHeader>
        <div className='flex items-center justify-between'>
          <div className='flex flex-col gap-y-1'>
            <Label>
              Appearance
            </Label>
            <span className='text-[0.8rem] text-muted-foreground'>
              Customize how Nocion looks on your device
            </span>
          </div>
          <ModeToggle />
        </div>
      </DialogContent>
    </Dialog>
  )
}
