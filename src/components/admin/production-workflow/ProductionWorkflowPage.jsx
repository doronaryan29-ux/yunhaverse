import { memo, useMemo, useState } from 'react'
import DeleteConfirmModal from './DeleteConfirmModal'
import ProductionWorkflowHeader from './ProductionWorkflowHeader'
import RequestFormModal from './RequestFormModal'
import RequestHistoryModal from './RequestHistoryModal'
import RequestsSection from './RequestsSection'
import StatusModal from './StatusModal'
import WorkflowCreatePanel from './WorkflowCreatePanel'
import ReviewActionModal from './ReviewActionModal'

const ProductionWorkflowPage = ({
  apiBase,
  requesterRole,
  userId,
  members = [],
  requests = [],
  loadingRequests = false,
  onRefresh,
}) => {
  const requestItems = Array.isArray(requests) ? requests : []
  const memberOptions = Array.isArray(members) ? members : []
  const [requestForm, setRequestForm] = useState({
    title: '',
    description: '',
    requestedBy: '',
    assignedTo: '',
    stage: 'creative',
    priority: 'Medium',
    status: 'open',
    dueAt: '',
  })
  const [requestEdits, setRequestEdits] = useState({})
  const [requestModalOpen, setRequestModalOpen] = useState(false)
  const [deleteModal, setDeleteModal] = useState(null)
  const [formStatus, setFormStatus] = useState({ type: '', message: '' })
  const [statusModal, setStatusModal] = useState(null)
  const [historyModal, setHistoryModal] = useState(null)
  const [historyItems, setHistoryItems] = useState([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [reviewModal, setReviewModal] = useState(null)
  const [reviewNote, setReviewNote] = useState('')
  const [reviewAssignee, setReviewAssignee] = useState('')
  const [requestStatusFilter, setRequestStatusFilter] = useState('all')
  const [requestSubmissionFilter, setRequestSubmissionFilter] = useState('all')

  const normalizedApiBase = apiBase || ''
  const canSubmit = Boolean(normalizedApiBase && requesterRole)
  const requestCount = requestItems.length

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
        status: 'open',
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


  const statusOptions = useMemo(
    () => [
      'open',
      'in_progress',
      'blocked',
      'submitted',
      'revision_requested',
      'declined',
      'completed',
    ],
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

  const normalizeStatus = (value) =>
    String(value || '')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '_')

  const getRequestEdit = (item) => {
    const current = requestEdits[item.id]
    return (
      current || {
        assignedTo: item.assigned_to || '',
        stage: item.stage || 'creative',
        status: normalizeStatus(item.status) || 'open',
        priority: item.priority || 'Medium',
        reviewNote: item.review_note || '',
      }
    )
  }

  const isRequestDirty = (item, edit) =>
    String(edit.assignedTo || '') !== String(item.assigned_to || '') ||
    String(edit.stage || '') !== String(item.stage || '') ||
    String(edit.status || '') !== String(item.status || '') ||
    String(edit.priority || '') !== String(item.priority || '') ||
    String(edit.reviewNote || '') !== String(item.review_note || '')

  const deleteRequestsBulk = async (ids) => {
    if (!canSubmit) return
    const uniqueIds = Array.from(new Set((ids || []).filter(Boolean)))
    if (uniqueIds.length === 0) return
    clearFormStatus()
    setSubmitting(true)
    try {
      const results = await Promise.all(
        uniqueIds.map(async (id) => {
          const response = await fetch(
            `${normalizedApiBase}/admin/creative-requests/${id}/delete?requesterRole=${encodeURIComponent(
              requesterRole,
            )}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
            },
          )
          const data = await response.json().catch(() => ({}))
          return { ok: response.ok, id, message: data?.message || '' }
        }),
      )
      const failed = results.filter((item) => !item.ok)
      if (failed.length > 0) {
        throw new Error(
          `Deleted ${uniqueIds.length - failed.length}/${uniqueIds.length}. Some requests failed to delete.`,
        )
      }
      setFormStatus({
        type: 'success',
        message: `${uniqueIds.length} request(s) deleted.`,
      })
      openStatusModal({
        type: 'success',
        title: 'Requests deleted',
        message: `${uniqueIds.length} request(s) were removed from archive.`,
      })
      onRefresh?.()
    } catch (error) {
      setFormStatus({ type: 'error', message: error.message })
      openStatusModal({
        type: 'error',
        title: 'Bulk delete failed',
        message: error.message || 'Failed to delete selected requests.',
      })
    } finally {
      setSubmitting(false)
    }
  }

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

  const getStatusBucket = (status) => {
    const normalized = normalizeStatus(status)
    if (['open', 'in_progress', 'blocked'].includes(normalized)) return 'open'
    if (normalized === 'submitted') return 'submitted'
    if (normalized === 'declined') return 'declined'
    if (normalized === 'revision_requested') return 'revision'
    if (['completed', 'approved', 'done'].includes(normalized)) {
      return 'accepted'
    }
    return 'open'
  }

  const filteredRequestItems = useMemo(() => {
    return requestItems.filter((item) => {
      const statusPass =
        requestStatusFilter === 'all' ||
        getStatusBucket(item?.status) === requestStatusFilter
      if (!statusPass) return false

      if (requestSubmissionFilter === 'all') return true
      const hasSubmission = Boolean(
        item?.submission_title || item?.submission_url || item?.submission_notes,
      )
      if (requestSubmissionFilter === 'with_submission') return hasSubmission
      if (requestSubmissionFilter === 'no_submission') return !hasSubmission
      return true
    })
  }, [requestItems, requestStatusFilter, requestSubmissionFilter])

  const queueRequestItems = useMemo(() => {
    const priorityRank = { high: 0, medium: 1, low: 2 }
    const statusRank = {
      open: 0,
      submitted: 1,
      revision: 2,
      accepted: 3,
    }
    return filteredRequestItems
      .filter((item) => getStatusBucket(item?.status) !== 'declined')
      .sort((a, b) => {
        const aStatus = statusRank[getStatusBucket(a?.status)] ?? 99
        const bStatus = statusRank[getStatusBucket(b?.status)] ?? 99
        if (aStatus !== bStatus) return aStatus - bStatus

        const aPriority = priorityRank[String(a?.priority || '').toLowerCase()] ?? 99
        const bPriority = priorityRank[String(b?.priority || '').toLowerCase()] ?? 99
        if (aPriority !== bPriority) return aPriority - bPriority

        const aDue = new Date(a?.due_at || 0).getTime()
        const bDue = new Date(b?.due_at || 0).getTime()
        if (Number.isFinite(aDue) && Number.isFinite(bDue) && aDue !== bDue) {
          return aDue - bDue
        }
        return String(a?.title || '').localeCompare(String(b?.title || ''))
      })
  }, [filteredRequestItems])

  const archivedRequestItems = useMemo(
    () =>
      filteredRequestItems
        .filter((item) => getStatusBucket(item?.status) === 'declined')
        .sort((a, b) => {
          const aUpdated = new Date(a?.updated_at || a?.created_at || 0).getTime()
          const bUpdated = new Date(b?.updated_at || b?.created_at || 0).getTime()
          return bUpdated - aUpdated
        }),
    [filteredRequestItems],
  )

  return (
    <section className="space-y-6">
      <ProductionWorkflowHeader total={requestCount} />
      <WorkflowCreatePanel
        onOpenRequest={() => setRequestModalOpen(true)}
        requestModalOpen={requestModalOpen}
        formStatus={formStatus}
      />
      <RequestsSection
        requestItems={queueRequestItems}
        archivedItems={archivedRequestItems}
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
        requestStatusFilter={requestStatusFilter}
        setRequestStatusFilter={setRequestStatusFilter}
        requestSubmissionFilter={requestSubmissionFilter}
        setRequestSubmissionFilter={setRequestSubmissionFilter}
        onOpenReview={(payload) => {
          setReviewModal(payload)
          setReviewNote(payload?.defaultNote || '')
          setReviewAssignee(payload?.defaultAssignee || '')
        }}
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
      <ReviewActionModal
        reviewModal={reviewModal}
        onClose={() => {
          setReviewModal(null)
          setReviewNote('')
          setReviewAssignee('')
        }}
        reviewNote={reviewNote}
        setReviewNote={setReviewNote}
        reviewAssignee={reviewAssignee}
        setReviewAssignee={setReviewAssignee}
        getMembersForStage={getMembersForStage}
        resolveMemberLabel={resolveMemberLabel}
        submitting={submitting}
        onConfirm={() => {
          if (!reviewModal) return
          const { request, action, nextStage } = reviewModal
          if (!request?.id) return
          if (action === 'approve') {
            if (!nextStage) {
              openStatusModal({
                type: 'error',
                title: 'No next stage',
                message: 'This request is already at the final stage.',
              })
              return
            }
            if (!reviewAssignee) {
              openStatusModal({
                type: 'error',
                title: 'Assignee required',
                message: 'Pick a team member for the next stage.',
              })
              return
            }
            updateRequest(request.id, {
              assignedTo: Number(reviewAssignee),
              stage: nextStage,
              status: 'open',
              reviewNote: reviewNote.trim() || null,
            })
          } else if (action === 'revise') {
            updateRequest(request.id, {
              status: 'revision_requested',
              reviewNote: reviewNote.trim() || null,
            })
          } else if (action === 'decline') {
            updateRequest(request.id, {
              status: 'declined',
              reviewNote: reviewNote.trim() || null,
            })
          }
          setReviewModal(null)
          setReviewNote('')
          setReviewAssignee('')
        }}
      />
      <DeleteConfirmModal
        deleteModal={deleteModal}
        onClose={() => setDeleteModal(null)}
        submitting={submitting}
        onConfirm={(payload) => {
          if (!payload) return
          if (Array.isArray(payload.ids) && payload.ids.length > 0) {
            deleteRequestsBulk(payload.ids)
            return
          }
          if (payload.type === 'request') {
            deleteRequest(payload.id)
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
