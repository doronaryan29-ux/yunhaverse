import { memo, useMemo, useState } from 'react'
import DeleteConfirmModal from './DeleteConfirmModal'
import ProductionWorkflowHeader from './ProductionWorkflowHeader'
import RequestFormModal from './RequestFormModal'
import RequestHistoryModal from './RequestHistoryModal'
import RequestsSection from './RequestsSection'
import StatusModal from './StatusModal'
import SubmissionFormModal from './SubmissionFormModal'
import SubmissionsSection from './SubmissionsSection'
import WorkflowCreatePanel from './WorkflowCreatePanel'

const ProductionWorkflowPage = ({
  apiBase,
  requesterRole,
  userId,
  members = [],
  requests = [],
  submissions = [],
  loadingRequests = false,
  loadingSubmissions = false,
  onRefresh,
}) => {
  const requestItems = Array.isArray(requests) ? requests : []
  const submissionItems = Array.isArray(submissions) ? submissions : []
  const memberOptions = Array.isArray(members) ? members : []
  const [requestForm, setRequestForm] = useState({
    title: '',
    description: '',
    requestedBy: '',
    assignedTo: '',
    stage: 'creative',
    priority: 'Medium',
    status: 'Open',
    dueAt: '',
  })
  const [submissionForm, setSubmissionForm] = useState({
    title: '',
    requestId: '',
    submittedBy: '',
    submissionUrl: '',
    notes: '',
    stage: 'creative',
    status: 'Pending_review',
  })
  const [requestEdits, setRequestEdits] = useState({})
  const [submissionEdits, setSubmissionEdits] = useState({})
  const [requestModalOpen, setRequestModalOpen] = useState(false)
  const [submissionModalOpen, setSubmissionModalOpen] = useState(false)
  const [deleteModal, setDeleteModal] = useState(null)
  const [formStatus, setFormStatus] = useState({ type: '', message: '' })
  const [statusModal, setStatusModal] = useState(null)
  const [historyModal, setHistoryModal] = useState(null)
  const [historyItems, setHistoryItems] = useState([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const normalizedApiBase = apiBase || ''
  const canSubmit = Boolean(normalizedApiBase && requesterRole)
  const requestCount = requestItems.length
  const submissionCount = submissionItems.length

  const clearFormStatus = () => setFormStatus({ type: '', message: '' })
  const openStatusModal = ({ type, title, message }) => {
    setStatusModal({ type, title, message })
  }

  const handleCreateRequest = async (event) => {
    event.preventDefault()
    if (!canSubmit) return
    clearFormStatus()
    setSubmitting(true)
    try {
      const response = await fetch(
        `${normalizedApiBase}/admin/creative-requests?requesterRole=${encodeURIComponent(
          requesterRole,
        )}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            requesterRole,
            title: requestForm.title.trim(),
            description: requestForm.description.trim() || null,
            requestedBy: requestForm.requestedBy
              ? Number(requestForm.requestedBy)
              : null,
            assignedTo: requestForm.assignedTo ? Number(requestForm.assignedTo) : null,
            stage: requestForm.stage,
            priority: requestForm.priority,
            status: requestForm.status,
            dueAt: requestForm.dueAt || null,
          }),
        },
      )
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.message || 'Failed to create request.')
      }
      setRequestForm({
        title: '',
        description: '',
        requestedBy: '',
        assignedTo: '',
        stage: 'creative',
        priority: 'Medium',
        status: 'Open',
        dueAt: '',
      })
      setFormStatus({ type: 'success', message: 'Request created.' })
      setRequestModalOpen(false)
      openStatusModal({
        type: 'success',
        title: 'Request created',
        message: 'The new creative request has been added.',
      })
      onRefresh?.()
    } catch (error) {
      setFormStatus({ type: 'error', message: error.message })
      openStatusModal({
        type: 'error',
        title: 'Request failed',
        message: error.message || 'Failed to create request.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleCreateSubmission = async (event) => {
    event.preventDefault()
    if (!canSubmit) return
    clearFormStatus()
    setSubmitting(true)
    try {
      const response = await fetch(
        `${normalizedApiBase}/admin/creative-submissions?requesterRole=${encodeURIComponent(
          requesterRole,
        )}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            requesterRole,
            title: submissionForm.title.trim(),
            requestId: submissionForm.requestId ? Number(submissionForm.requestId) : null,
            submittedBy: submissionForm.submittedBy
              ? Number(submissionForm.submittedBy)
              : null,
            submissionUrl: submissionForm.submissionUrl.trim() || null,
            notes: submissionForm.notes.trim() || null,
            stage: submissionForm.stage,
            status: submissionForm.status,
          }),
        },
      )
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.message || 'Failed to create submission.')
      }
      setSubmissionForm({
        title: '',
        requestId: '',
        submittedBy: '',
        submissionUrl: '',
        notes: '',
        stage: 'creative',
        status: 'Pending_Review',
      })
      setFormStatus({ type: 'success', message: 'Submission created.' })
      setSubmissionModalOpen(false)
      openStatusModal({
        type: 'success',
        title: 'Submission created',
        message: 'The submission has been logged for review.',
      })
      onRefresh?.()
    } catch (error) {
      setFormStatus({ type: 'error', message: error.message })
      openStatusModal({
        type: 'error',
        title: 'Submission failed',
        message: error.message || 'Failed to create submission.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const updateRequest = async (id, payload) => {
    if (!canSubmit) return
    clearFormStatus()
    setSubmitting(true)
    try {
      const response = await fetch(
        `${normalizedApiBase}/admin/creative-requests/${id}?requesterRole=${encodeURIComponent(
          requesterRole,
        )}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ requesterRole, updatedBy: userId || null, ...payload }),
        },
      )
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.message || 'Failed to update request.')
      }
      setFormStatus({ type: 'success', message: 'Request updated.' })
      openStatusModal({
        type: 'success',
        title: 'Request updated',
        message: 'The request changes were saved.',
      })
      onRefresh?.()
    } catch (error) {
      setFormStatus({ type: 'error', message: error.message })
      openStatusModal({
        type: 'error',
        title: 'Update failed',
        message: error.message || 'Failed to update request.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const deleteRequest = async (id) => {
    if (!canSubmit) return
    clearFormStatus()
    setSubmitting(true)
    try {
      const response = await fetch(
        `${normalizedApiBase}/admin/creative-requests/${id}/delete?requesterRole=${encodeURIComponent(
          requesterRole,
        )}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        },
      )
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.message || 'Failed to delete request.')
      }
      setFormStatus({ type: 'success', message: 'Request deleted.' })
      openStatusModal({
        type: 'success',
        title: 'Request deleted',
        message: 'The request has been removed.',
      })
      onRefresh?.()
    } catch (error) {
      setFormStatus({ type: 'error', message: error.message })
      openStatusModal({
        type: 'error',
        title: 'Delete failed',
        message: error.message || 'Failed to delete request.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const updateSubmission = async (id, payload) => {
    if (!canSubmit) return
    clearFormStatus()
    setSubmitting(true)
    try {
      const response = await fetch(
        `${normalizedApiBase}/admin/creative-submissions/${id}?requesterRole=${encodeURIComponent(
          requesterRole,
        )}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ requesterRole, ...payload }),
        },
      )
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.message || 'Failed to update submission.')
      }
      setFormStatus({ type: 'success', message: 'Submission updated.' })
      openStatusModal({
        type: 'success',
        title: 'Submission updated',
        message: 'The submission status was saved.',
      })
      onRefresh?.()
    } catch (error) {
      setFormStatus({ type: 'error', message: error.message })
      openStatusModal({
        type: 'error',
        title: 'Update failed',
        message: error.message || 'Failed to update submission.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const fetchHistory = async (requestId) => {
    if (!canSubmit || !requestId) return
    setHistoryLoading(true)
    try {
      const response = await fetch(
        `${normalizedApiBase}/admin/creative-requests/${requestId}/history?requesterRole=${encodeURIComponent(
          requesterRole,
        )}`,
      )
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.message || 'Failed to load history.')
      }
      setHistoryItems(Array.isArray(data.items) ? data.items : [])
    } catch (error) {
      setHistoryItems([])
      openStatusModal({
        type: 'error',
        title: 'History failed',
        message: error.message || 'Failed to load history.',
      })
    } finally {
      setHistoryLoading(false)
    }
  }

  const deleteSubmission = async (id) => {
    if (!canSubmit) return
    clearFormStatus()
    setSubmitting(true)
    try {
      const response = await fetch(
        `${normalizedApiBase}/admin/creative-submissions/${id}/delete?requesterRole=${encodeURIComponent(
          requesterRole,
        )}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        },
      )
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.message || 'Failed to delete submission.')
      }
      setFormStatus({ type: 'success', message: 'Submission deleted.' })
      openStatusModal({
        type: 'success',
        title: 'Submission deleted',
        message: 'The submission has been removed.',
      })
      onRefresh?.()
    } catch (error) {
      setFormStatus({ type: 'error', message: error.message })
      openStatusModal({
        type: 'error',
        title: 'Delete failed',
        message: error.message || 'Failed to delete submission.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const statusOptions = useMemo(
    () => ['Open', 'In_Progress', 'Blocked', 'Complete'],
    [],
  )
  const stageOptions = useMemo(
    () => [
      { value: 'creative', label: 'Creative' },
      { value: 'copywriter', label: 'Copywriter' },
      { value: 'sns', label: 'SNS Updater' },
      { value: 'done', label: 'Done' },
    ],
    [],
  )
  const submissionStatusOptions = useMemo(
    () => ['Pending_Review', 'Approved', 'Needs_Revisions', 'Rejected'],
    [],
  )
  const priorityOptions = useMemo(() => ['Low', 'Medium', 'High'], [])

  const resolveMemberName = (member) =>
    (
      member?.full_name ||
      [member?.first_name, member?.last_name].filter(Boolean).join(' ') ||
      [member?.firstName, member?.lastName].filter(Boolean).join(' ') ||
      member?.email ||
      ''
    ).trim()

  const resolveMemberLabel = (member) => {
    const name = resolveMemberName(member)
    return name ? `${name} (#${member.id})` : `User #${member.id}`
  }

  const getMemberNameById = (id) => {
    if (!id) return ''
    const match = memberOptions.find((member) => String(member.id) === String(id))
    return match ? resolveMemberName(match) : ''
  }

  const getRequestEdit = (item) => {
    const current = requestEdits[item.id]
    return (
      current || {
        assignedTo: item.assigned_to || '',
        stage: item.stage || 'creative',
        status: item.status || 'Open',
        priority: item.priority || 'Medium',
      }
    )
  }

  const getSubmissionEdit = (item) => {
    const current = submissionEdits[item.id]
    return current || { status: item.status || 'Pending_Review' }
  }

  const isRequestDirty = (item, edit) =>
    String(edit.assignedTo || '') !== String(item.assigned_to || '') ||
    String(edit.stage || '') !== String(item.stage || '') ||
    String(edit.status || '') !== String(item.status || '') ||
    String(edit.priority || '') !== String(item.priority || '')

  const isSubmissionDirty = (item, edit) =>
    String(edit.status || '') !== String(item.status || '')

  const getMembersForStage = (stage) => {
    const normalizedStage = String(stage || '').toLowerCase()
    if (!normalizedStage) return memberOptions
    return memberOptions.filter((member) => {
      const role = String(member?.role || '').toLowerCase()
      if (!role) return false
      if (normalizedStage === 'creative') {
        return role.includes('creative')
      }
      if (normalizedStage === 'copywriter') {
        return role.includes('copywriter')
      }
      if (normalizedStage === 'sns') {
        return role.includes('sns')
      }
      if (normalizedStage === 'done') {
        return false
      }
      return true
    })
  }

  const getNextStage = (stage) => {
    const sequence = ['creative', 'copywriter', 'sns', 'done']
    const index = sequence.indexOf(String(stage || 'creative').toLowerCase())
    return index >= 0 && index < sequence.length - 1 ? sequence[index + 1] : null
  }

  return (
    <section className="space-y-6">
      <ProductionWorkflowHeader total={requestCount + submissionCount} />
      <WorkflowCreatePanel
        onOpenRequest={() => setRequestModalOpen(true)}
        onOpenSubmission={() => setSubmissionModalOpen(true)}
        requestModalOpen={requestModalOpen}
        submissionModalOpen={submissionModalOpen}
        formStatus={formStatus}
      />
      <RequestsSection
        requestItems={requestItems}
        loadingRequests={loadingRequests}
        getRequestEdit={getRequestEdit}
        isRequestDirty={isRequestDirty}
        setRequestEdits={setRequestEdits}
        stageOptions={stageOptions}
        statusOptions={statusOptions}
        priorityOptions={priorityOptions}
        canSubmit={canSubmit}
        submitting={submitting}
        getMembersForStage={getMembersForStage}
        resolveMemberLabel={resolveMemberLabel}
        getMemberNameById={getMemberNameById}
        updateRequest={updateRequest}
        setDeleteModal={setDeleteModal}
        setHistoryModal={setHistoryModal}
        fetchHistory={fetchHistory}
        openStatusModal={openStatusModal}
        getNextStage={getNextStage}
      />
      <SubmissionsSection
        submissionItems={submissionItems}
        loadingSubmissions={loadingSubmissions}
        getSubmissionEdit={getSubmissionEdit}
        isSubmissionDirty={isSubmissionDirty}
        setSubmissionEdits={setSubmissionEdits}
        submissionStatusOptions={submissionStatusOptions}
        canSubmit={canSubmit}
        submitting={submitting}
        updateSubmission={updateSubmission}
        setDeleteModal={setDeleteModal}
      />
      <RequestFormModal
        open={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
        requestForm={requestForm}
        setRequestForm={setRequestForm}
        memberOptions={memberOptions}
        getMembersForStage={getMembersForStage}
        resolveMemberLabel={resolveMemberLabel}
        stageOptions={stageOptions}
        priorityOptions={priorityOptions}
        statusOptions={statusOptions}
        submitting={submitting}
        canSubmit={canSubmit}
        onSubmit={handleCreateRequest}
      />
      <SubmissionFormModal
        open={submissionModalOpen}
        onClose={() => setSubmissionModalOpen(false)}
        submissionForm={submissionForm}
        setSubmissionForm={setSubmissionForm}
        requestItems={requestItems}
        memberOptions={memberOptions}
        resolveMemberLabel={resolveMemberLabel}
        stageOptions={stageOptions}
        submissionStatusOptions={submissionStatusOptions}
        submitting={submitting}
        canSubmit={canSubmit}
        onSubmit={handleCreateSubmission}
      />
      <DeleteConfirmModal
        deleteModal={deleteModal}
        onClose={() => setDeleteModal(null)}
        submitting={submitting}
        onConfirm={(payload) => {
          if (!payload) return
          if (payload.type === 'request') {
            deleteRequest(payload.id)
          } else {
            deleteSubmission(payload.id)
          }
        }}
      />
      <StatusModal statusModal={statusModal} onClose={() => setStatusModal(null)} />
      <RequestHistoryModal
        historyModal={historyModal}
        historyItems={historyItems}
        historyLoading={historyLoading}
        onClose={() => {
          setHistoryModal(null)
          setHistoryItems([])
        }}
      />
    </section>
  )
}

export default memo(ProductionWorkflowPage)
