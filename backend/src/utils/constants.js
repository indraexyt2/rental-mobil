export const rentalStatusMapping = {
    PENDING: ['CONFIRMED', 'CANCELLED'],
    CONFIRMED: ['ACTIVE', 'CANCELLED'],
    ACTIVE: ['COMPLETED', 'CANCELLED'],
    COMPLETED: [''],
    CANCELLED: []
}