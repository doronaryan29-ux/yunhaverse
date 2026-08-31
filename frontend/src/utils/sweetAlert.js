import Swal from 'sweetalert2'

const BRAND_PRIMARY_COLOR = '#e11d48'
const BRAND_DANGER_COLOR = '#f43f5e'
const BRAND_CANCEL_COLOR = '#64748b'

const resolveStatusIconColor = (type) =>
  type === 'error' ? BRAND_DANGER_COLOR : BRAND_PRIMARY_COLOR

export const showStatusAlert = ({ type = 'success', title, message }) =>
  Swal.fire({
    icon: type === 'error' ? 'error' : 'success',
    iconColor: resolveStatusIconColor(type),
    title: title || (type === 'error' ? 'Action failed' : 'Success'),
    text: message || '',
    confirmButtonColor: type === 'error' ? BRAND_DANGER_COLOR : BRAND_PRIMARY_COLOR,
  })

export const showStatusToast = ({ type = 'success', message }) =>
  Swal.fire({
    toast: true,
    position: 'top',
    icon: type === 'error' ? 'error' : 'success',
    iconColor: resolveStatusIconColor(type),
    title: message || '',
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
  })

export const confirmDeleteAlert = async ({
  title = 'Confirm Delete',
  message = 'This action cannot be undone.',
  confirmText = 'Delete',
}) => {
  const result = await Swal.fire({
    icon: 'warning',
    iconColor: BRAND_DANGER_COLOR,
    title,
    text: message,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: 'Cancel',
    confirmButtonColor: BRAND_DANGER_COLOR,
    cancelButtonColor: BRAND_CANCEL_COLOR,
    reverseButtons: true,
  })
  return result.isConfirmed
}

export const confirmActionAlert = async ({
  title = 'Please Confirm',
  message = 'Are you sure you want to continue?',
  confirmText = 'Continue',
  intent = 'danger',
}) => {
  const isDanger = intent === 'danger'
  const result = await Swal.fire({
    icon: isDanger ? 'warning' : 'question',
    iconColor: isDanger ? BRAND_DANGER_COLOR : BRAND_PRIMARY_COLOR,
    title,
    text: message,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: 'Cancel',
    confirmButtonColor: isDanger ? BRAND_DANGER_COLOR : BRAND_PRIMARY_COLOR,
    cancelButtonColor: BRAND_CANCEL_COLOR,
    reverseButtons: true,
  })
  return result.isConfirmed
}
