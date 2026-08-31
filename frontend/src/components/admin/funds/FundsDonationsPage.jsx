import { memo, useRef, useState } from 'react'
import DonationFormModal from './DonationFormModal'
import DonationsTable from './DonationsTable'
import FundsHeader from './FundsHeader'
import FundsStats from './FundsStats'
import { confirmDeleteAlert, showStatusAlert } from '../../../utils/sweetAlert'

const FundsDonationsPage = ({
  donations = [],
  loading = false,
  apiBase,
  requesterRole,
  members = [],
  onRefresh,
}) => {
  const items = Array.isArray(donations) ? donations : []
  const memberOptions = Array.isArray(members) ? members : []
  const totalRaised = items.reduce((sum, item) => sum + Number(item.amount || 0), 0)
  const formatPeso = (value) =>
    `₱${Number(value || 0).toLocaleString('en-PH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  const [formOpen, setFormOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [donationForm, setDonationForm] = useState({
    userId: '',
    name: '',
    email: '',
    amount: '',
    channel: '',
    status: 'completed',
  })
  const [memberQuery, setMemberQuery] = useState('')
  const amountInputRef = useRef(null)
  const [rowEdits, setRowEdits] = useState({})
  const canSubmit = Boolean(apiBase && requesterRole)

  const resetDonationForm = () => {
    setDonationForm({
      userId: '',
      name: '',
      email: '',
      amount: '',
      channel: '',
      status: 'completed',
    })
    setMemberQuery('')
  }

  const resolveMemberName = (member) =>
    (
      member?.full_name ||
      [member?.first_name, member?.last_name].filter(Boolean).join(' ') ||
      [member?.firstName, member?.lastName].filter(Boolean).join(' ') ||
      member?.email ||
      ''
    ).trim()

  const filteredMembers = memberQuery
    ? memberOptions.filter((member) => {
        const haystack = `${resolveMemberName(member)} ${member.email || ''}`
          .trim()
          .toLowerCase()
        return haystack.includes(memberQuery.toLowerCase())
      })
    : memberOptions.slice(0, 6)

  const handleSelectMember = (member) => {
    const resolvedName = resolveMemberName(member)
    setDonationForm((prev) => ({
      ...prev,
      userId: String(member.id),
      name: resolvedName || prev.name,
      email: member.email || prev.email,
    }))
    setMemberQuery('')
    window.requestAnimationFrame(() => {
      amountInputRef.current?.focus()
    })
  }

  const handleCreateDonation = async (event) => {
    event.preventDefault()
    if (!canSubmit) return
    setSubmitting(true)
    try {
      const response = await fetch(
        `${apiBase}/admin/donations?requesterRole=${encodeURIComponent(requesterRole)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            requesterRole,
            userId: donationForm.userId ? Number(donationForm.userId) : null,
            name: donationForm.name.trim() || null,
            email: donationForm.email.trim() || null,
            amount: Number(donationForm.amount || 0),
            channel: donationForm.channel.trim() || null,
            status: donationForm.status,
            currency: 'PHP',
          }),
        },
      )
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.message || 'Failed to create donation.')
      }
      resetDonationForm()
      await showStatusAlert({
        type: 'success',
        title: 'Donation Created',
        message: 'Donation created.',
      })
      setFormOpen(false)
      onRefresh?.()
    } catch (error) {
      await showStatusAlert({
        type: 'error',
        title: 'Create Failed',
        message: error.message,
      })
    } finally {
      setSubmitting(false)
    }
  }

  const updateDonation = async (id, payload) => {
    if (!canSubmit) return
    setSubmitting(true)
    try {
      const response = await fetch(
        `${apiBase}/admin/donations/${id}?requesterRole=${encodeURIComponent(requesterRole)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ requesterRole, ...payload }),
        },
      )
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.message || 'Failed to update donation.')
      }
      await showStatusAlert({
        type: 'success',
        title: 'Donation Updated',
        message: 'Donation updated.',
      })
      onRefresh?.()
    } catch (error) {
      await showStatusAlert({
        type: 'error',
        title: 'Update Failed',
        message: error.message,
      })
    } finally {
      setSubmitting(false)
    }
  }

  const deleteDonation = async (id) => {
    if (!canSubmit) return
    setSubmitting(true)
    try {
      const response = await fetch(
        `${apiBase}/admin/donations/${id}/delete?requesterRole=${encodeURIComponent(requesterRole)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        },
      )
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.message || 'Failed to delete donation.')
      }
      await showStatusAlert({
        type: 'success',
        title: 'Donation Deleted',
        message: 'Donation deleted.',
      })
      onRefresh?.()
    } catch (error) {
      await showStatusAlert({
        type: 'error',
        title: 'Delete Failed',
        message: error.message,
      })
    } finally {
      setSubmitting(false)
    }
  }

  const requestDeleteDonation = async (item) => {
    if (!item?.id || !canSubmit || submitting) return
    const confirmed = await confirmDeleteAlert({
      title: 'Delete Donation',
      message: `Delete donation from "${item.name || item.email || 'Anonymous'}"?`,
    })
    if (!confirmed) return
    await deleteDonation(item.id)
  }

  const getEditRow = (item) =>
    rowEdits[item.id] || {
      amount: item.amount ?? '',
      status: item.status || 'completed',
    }

  const isDirty = (item, edit) =>
    String(edit.amount || '') !== String(item.amount || '') ||
    String(edit.status || '') !== String(item.status || '')

  return (
    <section className="space-y-6">
      <FundsHeader onAdd={() => setFormOpen(true)} />
      <FundsStats
        stats={[
          { label: 'Total Raised', value: formatPeso(totalRaised) },
          { label: 'Donations (30d)', value: items.length },
        ]}
      />
      <DonationsTable
        items={items}
        loading={loading}
        canSubmit={canSubmit}
        submitting={submitting}
        getEditRow={getEditRow}
        isDirty={isDirty}
        setRowEdits={setRowEdits}
        updateDonation={updateDonation}
        onRequestDelete={requestDeleteDonation}
      />
      <DonationFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        donationForm={donationForm}
        setDonationForm={setDonationForm}
        memberQuery={memberQuery}
        setMemberQuery={setMemberQuery}
        filteredMembers={filteredMembers}
        resolveMemberName={resolveMemberName}
        handleSelectMember={handleSelectMember}
        amountInputRef={amountInputRef}
        submitting={submitting}
        canSubmit={canSubmit}
        onSubmit={handleCreateDonation}
        onReset={resetDonationForm}
      />
    </section>
  )
}

export default memo(FundsDonationsPage)
