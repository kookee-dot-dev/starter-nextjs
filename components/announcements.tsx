'use client';

import { useId, useRef, useState, type MouseEvent } from 'react';
import type { AnnouncementDetail, AnnouncementListItem } from '@kookee/sdk';
import { AnnouncementArticle, AnnouncementList, AnnouncementPill } from '@kookee/react/announcements';
import { useDismissedAnnouncements } from '@kookee/react/announcements/client';

export function Announcements({ announcements }: { announcements: AnnouncementDetail[] }) {
  // Dismissals are kept in the browser, so `visible` is empty until hydration and the pill arrives after it.
  const { visible, dismiss } = useDismissedAnnouncements<AnnouncementListItem>({ announcements });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const selected = announcements.find((announcement) => announcement.id === selectedId);

  // The dialog's children fill it, so a click on the dialog itself is a click on the backdrop.
  function closeOnBackdrop(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) event.currentTarget.close();
  }

  function back() {
    setSelectedId(null);
    // The Back button goes away with the article, so focus moves to the dialog, not to the page.
    dialog.current?.focus();
  }

  return (
    <>
      <div className="site-announcement-slot">
        <AnnouncementPill announcement={visible[0]} onOpen={() => dialog.current?.showModal()} onDismiss={dismiss} />
      </div>
      <dialog
        ref={dialog}
        className="site-announcements"
        aria-labelledby={titleId}
        tabIndex={-1}
        onClose={() => setSelectedId(null)}
        onClick={closeOnBackdrop}
      >
        <div className="site-announcements-header">
          <h2 id={titleId}>Announcements</h2>
          <button
            type="button"
            className="site-announcements-close"
            aria-label="Close"
            onClick={() => dialog.current?.close()}
          >
            ×
          </button>
        </div>
        <div className="site-announcements-body">
          {selected ? (
            <div className="site-announcements-detail">
              <button type="button" className="site-announcements-back" onClick={back} autoFocus>
                ← Back
              </button>
              <AnnouncementArticle announcement={selected} headingLevel={3} />
            </div>
          ) : (
            <AnnouncementList
              announcements={visible}
              onSelect={(announcement) => setSelectedId(announcement.id)}
              onDismiss={dismiss}
            />
          )}
        </div>
      </dialog>
    </>
  );
}
