
import { useWallet } from '@/contexts/WalletContext'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import { Heart, WalletCards } from 'lucide-react'

const HeaderExtension = () => {
  const { address, isConnected, connect, disconnect } = useWallet()
  const navigate = useNavigate()

  return (
    <div className='flex items-center gap-2'>
      {isConnected ? (
        <div className='flex items-center gap-3'>
          <Button 
            onClick={() => navigate('/rewards')}
            size="sm" 
            variant="outline"
            className="flex items-center gap-1 hover:bg-newsweave-primary/10 border-newsweave-primary/20"
          >
            <Heart className='w-4 h-4 text-newsweave-primary' /> Rewards
          </Button>
          
          <div className="hidden md:flex items-center gap-2">
            <WalletCards className="h-4 w-4 text-newsweave-primary" />
            <span className="text-sm font-medium text-newsweave-primary">
              {address?.substring(0, 5)}...{address?.substring(address.length - 4)}
            </span>
          </div>
          
          <Button 
            size="sm" 
            variant="ghost"
            onClick={disconnect}
            className="text-xs hover:bg-red-100 hover:text-red-700"
          >
            Disconnect
          </Button>
        </div>
      ) : (
        <Button 
          onClick={connect}
          size="sm" 
          variant="default"
          className="bg-gradient-to-r from-newsweave-primary to-newsweave-secondary hover:opacity-90"
        >
          Connect Wallet
        </Button>
      )}
    </div>
  )
}

export default HeaderExtension
