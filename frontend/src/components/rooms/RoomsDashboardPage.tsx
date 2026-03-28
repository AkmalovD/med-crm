"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { DashboardScaffold } from "../dashboard/DashboardScaffold";
import {
  getRoomScheduleSlots,
  INITIAL_ROOMS,
  ROOMS_PAGE_SIZE,
} from "@/data/roomsData/roomsDashboardData";
import { useRoomStore } from "@/store/useRoomStore";
import type { Room, RoomFilters, RoomSortBy, RoomsViewMode, SortDir } from "@/types/roomsDashboardTypes";
import type { CreateRoomInput } from "@/validators/createRoom.schema";
import {
  buildRoomsSearchParams,
  createRoomId,
  filterAndSortRooms,
  parsePage,
  parseRoomStatusParam,
  parseRoomTypeParam,
  parseRoomsViewMode,
  parseSortBy,
  parseSortDir,
} from "@/utils/roomsDashboardUtils";

import { CreateRoomModal } from "./CreateRoomModal";
import { EditRoomModal } from "./EditRoomModal";
import { MaintenanceModeModal } from "./MaintenanceModeModal";
import { RoomSchedulePanel } from "./RoomSchedulePanel";
import { RoomsFilterBar } from "./RoomsFilterBar";
import { RoomsGrid } from "./RoomsGrid";
import { RoomsPageHeader } from "./RoomsPageHeader";
import { RoomsTable } from "./RoomsTable";
import { RoomsViewToggle } from "./RoomsViewToggle";
import { RoomUtilizationBar } from "./RoomUtilizationBar";
import styles from "./RoomsDashboardPage.module.css";

export function RoomsDashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);
  const [searchInput, setSearchInput] = useState(() => searchParams.get("search") ?? "");
  const [debouncedSearch, setDebouncedSearch] = useState(() => (searchParams.get("search") ?? "").trim());

  const typeFilter = parseRoomTypeParam(searchParams.get("type"));
  const statusFilter = parseRoomStatusParam(searchParams.get("status"));
  const viewMode = parseRoomsViewMode(searchParams.get("view"));
  const page = parsePage(searchParams.get("page"));
  const sortBy = parseSortBy(searchParams.get("sortBy"));
  const sortDir = parseSortDir(searchParams.get("sortDir"));

  const [deleteTarget, setDeleteTarget] = useState<Room | null>(null);
  const skipNextSearchUrlSync = useRef(false);
  const searchUrlSyncReady = useRef(false);

  const isCreateModalOpen = useRoomStore((s) => s.isCreateModalOpen);
  const isEditModalOpen = useRoomStore((s) => s.isEditModalOpen);
  const isMaintenanceModalOpen = useRoomStore((s) => s.isMaintenanceModalOpen);
  const activeRoomId = useRoomStore((s) => s.activeRoomId);
  const isSchedulePanelOpen = useRoomStore((s) => s.isSchedulePanelOpen);
  const selectedRoomId = useRoomStore((s) => s.selectedRoomId);
  const openCreateModal = useRoomStore((s) => s.openCreateModal);
  const closeCreateModal = useRoomStore((s) => s.closeCreateModal);
  const closeEditModal = useRoomStore((s) => s.closeEditModal);
  const closeMaintenanceModal = useRoomStore((s) => s.closeMaintenanceModal);
  const closeSchedulePanel = useRoomStore((s) => s.closeSchedulePanel);

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedSearch(searchInput.trim()), 300);
    return () => window.clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    const s = searchParams.get("search") ?? "";
    setSearchInput((prev) => (prev === s ? prev : s));
  }, [searchParams]);

  const pushFilters = useCallback(
    (next: Partial<RoomFilters>) => {
      const merged: RoomFilters = {
        search: debouncedSearch,
        type: typeFilter,
        status: statusFilter,
        view: viewMode,
        page,
        sortBy,
        sortDir,
        ...next,
      };
      const qs = buildRoomsSearchParams(merged).toString();
      router.replace(qs ? `/rooms?${qs}` : "/rooms", { scroll: false });
    },
    [debouncedSearch, typeFilter, statusFilter, viewMode, page, sortBy, sortDir, router],
  );

  useEffect(() => {
    if (!searchUrlSyncReady.current) {
      searchUrlSyncReady.current = true;
      return;
    }
    if (skipNextSearchUrlSync.current) {
      skipNextSearchUrlSync.current = false;
      return;
    }
    pushFilters({ search: debouncedSearch, page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- URL sync for search only
  }, [debouncedSearch]);

  const filteredRooms = useMemo(
    () => filterAndSortRooms(rooms, debouncedSearch, typeFilter, statusFilter, sortBy, sortDir),
    [rooms, debouncedSearch, typeFilter, statusFilter, sortBy, sortDir],
  );

  const totalPages = Math.max(1, Math.ceil(filteredRooms.length / ROOMS_PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginatedRooms = filteredRooms.slice((safePage - 1) * ROOMS_PAGE_SIZE, safePage * ROOMS_PAGE_SIZE);

  const activeEditRoom = useMemo(
    () => (activeRoomId ? rooms.find((r) => r.id === activeRoomId) ?? null : null),
    [rooms, activeRoomId],
  );

  const activeMaintenanceRoom = useMemo(
    () => (activeRoomId ? rooms.find((r) => r.id === activeRoomId) ?? null : null),
    [rooms, activeRoomId],
  );

  const selectedRoom = useMemo(
    () => (selectedRoomId ? rooms.find((r) => r.id === selectedRoomId) ?? null : null),
    [rooms, selectedRoomId],
  );

  const getSlots = useCallback((roomId: string, isoDate: string) => getRoomScheduleSlots(roomId, isoDate), []);

  const handleCreate = (data: CreateRoomInput) => {
    const now = new Date().toISOString();
    const newRoom: Room = {
      id: createRoomId(),
      name: data.name,
      description: data.description ?? null,
      type: data.type,
      capacity: data.capacity,
      floor: data.floor?.trim() ? data.floor.trim() : null,
      color: data.color,
      amenities: data.amenities,
      openTime: data.openTime,
      closeTime: data.closeTime,
      status: "available",
      maintenanceFrom: null,
      maintenanceUntil: null,
      maintenanceNote: null,
      todaySessionCount: 0,
      utilizationRate: 0,
      upcomingBookingsCount: 0,
      createdAt: now,
      updatedAt: now,
    };
    setRooms((prev) => [...prev, newRoom]);
    closeCreateModal();
  };

  const handleUpdate = (id: string, data: Partial<CreateRoomInput>) => {
    const now = new Date().toISOString();
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        return {
          ...r,
          ...data,
          description: data.description !== undefined ? (data.description ?? null) : r.description,
          floor: data.floor !== undefined ? (data.floor?.trim() ? data.floor.trim() : null) : r.floor,
          amenities: data.amenities ?? r.amenities,
          updatedAt: now,
        };
      }),
    );
    closeEditModal();
  };

  const handleSetMaintenance = (
    id: string,
    payload: { maintenanceFrom: string; maintenanceUntil: string; maintenanceNote: string | null },
  ) => {
    const now = new Date().toISOString();
    setRooms((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: "maintenance" as const,
              maintenanceFrom: payload.maintenanceFrom,
              maintenanceUntil: payload.maintenanceUntil,
              maintenanceNote: payload.maintenanceNote,
              updatedAt: now,
            }
          : r,
      ),
    );
    closeMaintenanceModal();
  };

  const clearMaintenanceForRoom = (id: string) => {
    const now = new Date().toISOString();
    setRooms((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: "available" as const,
              maintenanceFrom: null,
              maintenanceUntil: null,
              maintenanceNote: null,
              updatedAt: now,
            }
          : r,
      ),
    );
  };

  const requestClearMaintenance = (id: string) => {
    if (!window.confirm("Mark this room as available again?")) return;
    clearMaintenanceForRoom(id);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.upcomingBookingsCount > 0) {
      setDeleteTarget(null);
      return;
    }
    setRooms((prev) => prev.filter((r) => r.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const setViewMode = (mode: RoomsViewMode) => pushFilters({ view: mode, page: 1 });
  const setTypeFilter = (t: RoomFilters["type"]) => pushFilters({ type: t, page: 1 });
  const setStatusFilter = (s: RoomFilters["status"]) => pushFilters({ status: s, page: 1 });
  const setSort = (sb: RoomSortBy, sd: SortDir) => pushFilters({ sortBy: sb, sortDir: sd, page: 1 });

  return (
    <DashboardScaffold>
      <div className={styles.pageWithPanel}>
        <div className={styles.mainColumn}>
          <div className={styles.page}>
            <RoomsPageHeader totalRooms={rooms.length} onAddRoom={openCreateModal} />
            <RoomUtilizationBar rooms={rooms} />
            <RoomsFilterBar
              searchInput={searchInput}
              typeFilter={typeFilter}
              statusFilter={statusFilter}
              onSearchInputChange={(value) => {
                setSearchInput(value);
              }}
              onTypeChange={setTypeFilter}
              onStatusChange={setStatusFilter}
              onClear={() => {
                setSearchInput("");
                setDebouncedSearch("");
                skipNextSearchUrlSync.current = true;
                router.replace("/rooms", { scroll: false });
              }}
            />

            <div className={styles.toolRow}>
              <RoomsViewToggle viewMode={viewMode} onChange={setViewMode} />
              <div className={styles.actionsRow}>
                <span className={styles.subtle}>
                  Page {safePage} / {totalPages}
                </span>
                <button
                  type="button"
                  className={styles.ghostButton}
                  disabled={safePage <= 1}
                  onClick={() => pushFilters({ page: safePage - 1 })}
                >
                  Prev
                </button>
                <button
                  type="button"
                  className={styles.ghostButton}
                  disabled={safePage >= totalPages}
                  onClick={() => pushFilters({ page: safePage + 1 })}
                >
                  Next
                </button>
              </div>
            </div>

            {paginatedRooms.length === 0 ? (
              <div className={styles.emptyState}>
                <p className={styles.emptyTitle}>No rooms match your filters</p>
                <p className={styles.subtle} style={{ margin: "0 0 16px" }}>
                  Try clearing filters or add your first room.
                </p>
                <button type="button" className={styles.primaryButton} onClick={openCreateModal}>
                  Add your first room
                </button>
              </div>
            ) : viewMode === "grid" ? (
              <RoomsGrid
                rooms={paginatedRooms}
                onDeleteRequest={setDeleteTarget}
                onClearMaintenance={requestClearMaintenance}
              />
            ) : (
              <RoomsTable
                rooms={paginatedRooms}
                sortBy={sortBy}
                sortDir={sortDir}
                onSortChange={setSort}
                onDeleteRequest={setDeleteTarget}
                onClearMaintenance={requestClearMaintenance}
              />
            )}
          </div>
        </div>

        {isSchedulePanelOpen && selectedRoom ? (
          <RoomSchedulePanel room={selectedRoom} getSlots={getSlots} onClose={closeSchedulePanel} />
        ) : null}
      </div>

      <CreateRoomModal isOpen={isCreateModalOpen} onClose={closeCreateModal} onSubmit={handleCreate} />
      <EditRoomModal
        isOpen={isEditModalOpen}
        room={activeEditRoom}
        onClose={closeEditModal}
        onSubmit={handleUpdate}
      />
      <MaintenanceModeModal
        isOpen={isMaintenanceModalOpen}
        room={activeMaintenanceRoom}
        onClose={closeMaintenanceModal}
        onSetMaintenance={handleSetMaintenance}
        onClearMaintenance={clearMaintenanceForRoom}
      />

      {deleteTarget ? (
        <div className={styles.confirmOverlay} role="dialog" aria-modal="true">
          <div className={styles.confirmCard}>
            <h3 className={styles.confirmTitle}>Delete room?</h3>
            {deleteTarget.upcomingBookingsCount > 0 ? (
              <p className={styles.confirmText}>
                This room has {deleteTarget.upcomingBookingsCount} upcoming session
                {deleteTarget.upcomingBookingsCount === 1 ? "" : "s"}. Reassign them before deleting.
              </p>
            ) : (
              <p className={styles.confirmText}>
                Permanently remove <strong>{deleteTarget.name}</strong>? This cannot be undone.
              </p>
            )}
            <div className={styles.actionsRow} style={{ justifyContent: "flex-end" }}>
              <button type="button" className={styles.ghostButton} onClick={() => setDeleteTarget(null)}>
                Cancel
              </button>
              {deleteTarget.upcomingBookingsCount === 0 ? (
                <button type="button" className={styles.dangerButton} onClick={confirmDelete}>
                  Delete
                </button>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </DashboardScaffold>
  );
}
