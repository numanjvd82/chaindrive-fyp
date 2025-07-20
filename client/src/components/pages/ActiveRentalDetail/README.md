# Rental Detail Components

This directory contains the refactored rental detail components for both owners and renters.

## Structure

### Components

#### Shared Components

- **`RentalHeader.tsx`** - Header for owner rental management
- **`CompletionStatus.tsx`** - Completion status for owners
- **`VehicleLocation.tsx`** - Vehicle location map (only for active rentals)
- **`ViolationReports.tsx`** - Display violation reports
- **`VehicleDetails.tsx`** - Vehicle specifications and rental timeline
- **`ActionButtons.tsx`** - Owner action buttons (confirm, cancel, complete, report violation)
- **`LateFeeDisplay.tsx`** - Display late fees when rental is overdue (shared between owner and renter)

#### Renter-Specific Components

- **`RenterHeader.tsx`** - Header for renter rental view ("My Rental")
- **`RenterCompletionStatus.tsx`** - Completion status for renters
- **`RenterActionButtons.tsx`** - Renter action buttons (cancel, complete only)

### Hooks

- **`useRentalActions.ts`** - Owner rental actions (confirm, cancel, complete rental by owner)
- **`useRenterActions.ts`** - Renter rental actions (cancel, complete rental by renter)
- **`useLateFee.ts`** - Calculate and track late fees for overdue rentals

### Main Components

- **`RentalDetailForOwner.tsx`** - Owner rental management page
- **`RentalDetailForRenter.tsx`** - Renter rental view page

## Key Differences Between Owner and Renter Views

### Owner Can:

- View vehicle location (when rental is active)
- Confirm pending rentals
- Cancel pending rentals
- Complete rental from owner side
- Report violations after rental completion
- View violation reports

### Renter Can:

- Cancel pending rentals
- Complete rental from renter side
- View violation reports (but cannot create them)
- View owner information

### Shared Features:

- View vehicle details and specifications
- View rental timeline
- View completion status
- View violation reports (read-only for renter)

## Component Reusability

Most components are reusable between owner and renter views:

- `VehicleDetails` - Same vehicle information
- `ViolationReports` - Same violation display (renter is read-only)

Renter-specific components have different text and limited functionality:

- Different header titles
- Different completion status messages
- Limited action buttons (no violation reporting)

## Benefits

1. **Single Responsibility** - Each component has one clear purpose
2. **Reusability** - Shared components reduce code duplication
3. **Maintainability** - Easier to update and debug specific features
4. **Testing** - Each component can be tested independently
5. **Performance** - Smaller components can be optimized individually

## Late Fee Feature

### `LateFeeDisplay` Component

- **Purpose**: Display late fees when rental is past the end date
- **Features**:
  - Shows hours overdue
  - Displays late fee in both ETH and PKR
  - Real-time updates every minute
  - Warning messages about late fee accumulation
  - Only shows when rental is actually late and not completed

### `useLateFee` Hook

- **Purpose**: Calculate late fees using smart contract function
- **Features**:
  - Calls `calculateLateFee` contract function
  - Converts ETH to PKR using `usePkrToEth` hook
  - Real-time calculation based on hours late
  - Error handling and loading states
  - Auto-updates every minute

### Contract Integration

- Uses `calculateLateFee(rentalId, hoursLate)` from CarRentalUpgradeable contract
- Late fee rate: 0.001 ETH per hour
- Maximum late fee: 3x the original rental fee
- Only applies when current time > rental end date and rental not completed
